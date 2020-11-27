(function() {
  var config, plugins, proxy;

  proxy = require("../services/php-proxy.coffee");

  config = require("../config.coffee");

  plugins = require("../services/plugin-manager.coffee");

  module.exports = {
    structureStartRegex: /(?:abstract class|class|trait|interface)\s+(\w+)/,
    useStatementRegex: /(?:use)(?:[^\w\\])([\w\\]+)(?![\w\\])(?:(?:[ ]+as[ ]+)(\w+))?(?:;)/,
    cache: [],
    isFunction: false,

    /**
     * Retrieves the class the specified term (method or property) is being invoked on.
     *
     * @param  {TextEditor} editor         TextEditor to search for namespace of term.
     * @param  {string}     term           Term to search for.
     * @param  {Point}      bufferPosition The cursor location the term is at.
     *
     * @return {string}
     *
     * @example Invoking it on MyMethod::foo()->bar() will ask what class 'bar' is invoked on, which will whatever type
     *          foo returns.
     */
    getCalledClass: function(editor, term, bufferPosition) {
      var fullCall;
      fullCall = this.getStackClasses(editor, bufferPosition);
      if ((fullCall != null ? fullCall.length : void 0) === 0 || !term) {
        return;
      }
      return this.parseElements(editor, bufferPosition, fullCall);
    },

    /**
     * Get all variables declared in the current function
     * @param {TextEdutir} editor         Atom text editor
     * @param {Range}      bufferPosition Position of the current buffer
     */
    getAllVariablesInFunction: function(editor, bufferPosition) {
      var isInFunction, matches, regex, startPosition, text;
      isInFunction = this.isInFunction(editor, bufferPosition);
      startPosition = null;
      if (isInFunction) {
        startPosition = this.cache['functionPosition'];
      } else {
        startPosition = [0, 0];
      }
      text = editor.getTextInBufferRange([startPosition, [bufferPosition.row, bufferPosition.column - 1]]);
      regex = /(\$[a-zA-Z_]+)/g;
      matches = text.match(regex);
      if (matches == null) {
        return [];
      }
      if (isInFunction) {
        matches.push("$this");
      }
      return matches;
    },

    /**
     * Retrieves the full class name. If the class name is a FQCN (Fully Qualified Class Name), it already is a full
     * name and it is returned as is. Otherwise, the current namespace and use statements are scanned.
     *
     * @param {TextEditor}  editor    Text editor instance.
     * @param {string|null} className Name of the class to retrieve the full name of. If null, the current class will
     *                                be returned (if any).
     * @param {boolean}     noCurrent Do not use the current class if className is empty
     *
     * @return string
     */
    getFullClassName: function(editor, className, noCurrent) {
      var classNameParts, definitionPattern, found, fullClass, i, importNameParts, isAliasedImport, j, len, line, lines, matches, methodsRequest, namespacePattern, text, usePattern;
      if (className == null) {
        className = null;
      }
      if (noCurrent == null) {
        noCurrent = false;
      }
      if (className === null) {
        className = '';
        if (noCurrent) {
          return null;
        }
      }
      if (className && className[0] === "\\") {
        return className.substr(1);
      }
      usePattern = /^[ \t]*(?:use)(?:[^\w\\\\])([\w\\\\]+)(?![\w\\\\])(?:(?:[ ]+as[ ]+)(\w+))?(?:;)/;
      namespacePattern = /^[ \t]*(?:namespace)(?:[^\w\\\\])([\w\\\\]+)(?![\w\\\\])(?:;)/;
      definitionPattern = /^[ \t]*(?:abstract class|class|trait|interface)\s+(\w+)/;
      text = editor.getText();
      lines = text.split('\n');
      fullClass = className;
      found = false;
      for (i = j = 0, len = lines.length; j < len; i = ++j) {
        line = lines[i];
        matches = line.match(namespacePattern);
        if (matches) {
          fullClass = matches[1] + '\\' + className;
        } else if (className) {
          matches = line.match(usePattern);
          if (matches) {
            classNameParts = className.split('\\');
            importNameParts = matches[1].split('\\');
            isAliasedImport = matches[2] ? true : false;
            if (className === matches[1]) {
              fullClass = className;
              break;
            } else if ((isAliasedImport && matches[2] === classNameParts[0]) || (!isAliasedImport && importNameParts[importNameParts.length - 1] === classNameParts[0])) {
              found = true;
              fullClass = matches[1];
              classNameParts = classNameParts.slice(1, +classNameParts.length + 1 || 9e9);
              if (classNameParts.length > 0) {
                fullClass += '\\' + classNameParts.join('\\');
              }
              break;
            }
          }
        }
        matches = line.match(definitionPattern);
        if (matches) {
          if (!className) {
            found = true;
            fullClass += matches[1];
          }
          break;
        }
      }
      if (fullClass && fullClass[0] === '\\') {
        fullClass = fullClass.substr(1);
      }
      if (!found) {
        methodsRequest = proxy.methods(fullClass);
        if (!(methodsRequest != null ? methodsRequest.filename : void 0)) {
          fullClass = className;
        }
      }
      return fullClass;
    },

    /**
     * Add the use for the given class if not already added.
     *
     * @param {TextEditor} editor                  Atom text editor.
     * @param {string}     className               Name of the class to add.
     * @param {boolean}    allowAdditionalNewlines Whether to allow adding additional newlines to attempt to group use
     *                                             statements.
     *
     * @return {int}       The amount of lines added (including newlines), so you can reliably and easily offset your
     *                     rows. This could be zero if a use statement was already present.
     */
    addUseClass: function(editor, className, allowAdditionalNewlines) {
      var bestScore, bestUse, doNewLine, i, j, line, lineCount, lineEnding, lineToInsertAt, matches, placeBelow, ref, scopeDescriptor, score, textToInsert;
      if (className.split('\\').length === 1 || className.indexOf('\\') === 0) {
        return null;
      }
      bestUse = 0;
      bestScore = 0;
      placeBelow = true;
      doNewLine = true;
      lineCount = editor.getLineCount();
      for (i = j = 0, ref = lineCount - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        line = editor.lineTextForBufferRow(i).trim();
        if (line.length === 0) {
          continue;
        }
        scopeDescriptor = editor.scopeDescriptorForBufferPosition([i, line.length]).getScopeChain();
        if (scopeDescriptor.indexOf('.comment') >= 0) {
          continue;
        }
        if (line.match(this.structureStartRegex)) {
          break;
        }
        if (line.indexOf('namespace ') >= 0) {
          bestUse = i;
        }
        matches = this.useStatementRegex.exec(line);
        if ((matches != null) && (matches[1] != null)) {
          if (matches[1] === className) {
            return 0;
          }
          score = this.scoreClassName(className, matches[1]);
          if (score >= bestScore) {
            bestUse = i;
            bestScore = score;
            if (this.doShareCommonNamespacePrefix(className, matches[1])) {
              doNewLine = false;
              placeBelow = className.length >= matches[1].length ? true : false;
            } else {
              doNewLine = true;
              placeBelow = true;
            }
          }
        }
      }
      lineEnding = editor.getBuffer().lineEndingForRow(0);
      if (!allowAdditionalNewlines) {
        doNewLine = false;
      }
      if (!lineEnding) {
        lineEnding = "\n";
      }
      textToInsert = '';
      if (doNewLine && placeBelow) {
        textToInsert += lineEnding;
      }
      textToInsert += ("use " + className + ";") + lineEnding;
      if (doNewLine && !placeBelow) {
        textToInsert += lineEnding;
      }
      lineToInsertAt = bestUse + (placeBelow ? 1 : 0);
      editor.setTextInBufferRange([[lineToInsertAt, 0], [lineToInsertAt, 0]], textToInsert);
      return 1 + (doNewLine ? 1 : 0);
    },

    /**
     * Returns a boolean indicating if the specified class names share a common namespace prefix.
     *
     * @param {string} firstClassName
     * @param {string} secondClassName
     *
     * @return {boolean}
     */
    doShareCommonNamespacePrefix: function(firstClassName, secondClassName) {
      var firstClassNameParts, secondClassNameParts;
      firstClassNameParts = firstClassName.split('\\');
      secondClassNameParts = secondClassName.split('\\');
      firstClassNameParts.pop();
      secondClassNameParts.pop();
      if (firstClassNameParts.join('\\') === secondClassNameParts.join('\\')) {
        return true;
      } else {
        return false;
      }
    },

    /**
     * Scores the first class name against the second, indicating how much they 'match' each other. This can be used
     * to e.g. find an appropriate location to place a class in an existing list of classes.
     *
     * @param {string} firstClassName
     * @param {string} secondClassName
     *
     * @return {float}
     */
    scoreClassName: function(firstClassName, secondClassName) {
      var firstClassNameParts, i, j, maxLength, ref, secondClassNameParts, totalScore;
      firstClassNameParts = firstClassName.split('\\');
      secondClassNameParts = secondClassName.split('\\');
      maxLength = 0;
      if (firstClassNameParts.length > secondClassNameParts.length) {
        maxLength = secondClassNameParts.length;
      } else {
        maxLength = firstClassNameParts.length;
      }
      totalScore = 0;
      for (i = j = 0, ref = maxLength - 2; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        if (firstClassNameParts[i] === secondClassNameParts[i]) {
          totalScore += 2;
        }
      }
      if (this.doShareCommonNamespacePrefix(firstClassName, secondClassName)) {
        if (firstClassName.length === secondClassName.length) {
          totalScore += 2;
        } else {
          totalScore -= 0.001 * Math.abs(secondClassName.length - firstClassName.length);
        }
      }
      return totalScore;
    },

    /**
     * Checks if the given name is a class or not
     * @param  {string}  name Name to check
     * @return {Boolean}
     */
    isClass: function(name) {
      return name.substr(0, 1).toUpperCase() + name.substr(1) === name;
    },

    /**
     * Checks if the current buffer is in a functon or not
     * @param {TextEditor} editor         Atom text editor
     * @param {Range}      bufferPosition Position of the current buffer
     * @return bool
     */
    isInFunction: function(editor, bufferPosition) {
      var chain, character, closedBlocks, lastChain, line, lineLength, openedBlocks, result, row, rows, text;
      text = editor.getTextInBufferRange([[0, 0], bufferPosition]);
      if (this.cache[text] != null) {
        return this.cache[text];
      }
      this.cache = [];
      row = bufferPosition.row;
      rows = text.split('\n');
      openedBlocks = 0;
      closedBlocks = 0;
      result = false;
      while (row !== -1) {
        line = rows[row];
        if (!line) {
          row--;
          continue;
        }
        character = 0;
        lineLength = line.length;
        lastChain = null;
        while (character <= line.length) {
          chain = editor.scopeDescriptorForBufferPosition([row, character]).getScopeChain();
          if (!(character === line.length && chain === lastChain)) {
            if (chain.indexOf("scope.end") !== -1) {
              closedBlocks++;
            } else if (chain.indexOf("scope.begin") !== -1) {
              openedBlocks++;
            }
          }
          lastChain = chain;
          character++;
        }
        chain = editor.scopeDescriptorForBufferPosition([row, line.length]).getScopeChain();
        if (chain.indexOf("function") !== -1) {
          if (openedBlocks > closedBlocks) {
            result = true;
            this.cache["functionPosition"] = [row, 0];
            break;
          }
        }
        row--;
      }
      this.cache[text] = result;
      return result;
    },

    /**
     * Retrieves the stack of elements in a stack of calls such as "self::xxx->xxxx".
     *
     * @param  {TextEditor} editor
     * @param  {Point}       position
     *
     * @return {Object}
     */
    getStackClasses: function(editor, position) {
      var finished, i, line, lineText, parenthesesClosed, parenthesesOpened, scopeDescriptor, squiggleBracketsClosed, squiggleBracketsOpened, textSlice;
      if (position == null) {
        return;
      }
      line = position.row;
      finished = false;
      parenthesesOpened = 0;
      parenthesesClosed = 0;
      squiggleBracketsOpened = 0;
      squiggleBracketsClosed = 0;
      while (line > 0) {
        lineText = editor.lineTextForBufferRow(line);
        if (!lineText) {
          return;
        }
        if (line !== position.row) {
          i = lineText.length - 1;
        } else {
          i = position.column - 1;
        }
        while (i >= 0) {
          if (lineText[i] === '(') {
            ++parenthesesOpened;
            if (parenthesesOpened > parenthesesClosed) {
              ++i;
              finished = true;
              break;
            }
          } else if (lineText[i] === ')') {
            ++parenthesesClosed;
          } else if (lineText[i] === '{') {
            ++squiggleBracketsOpened;
            if (squiggleBracketsOpened > squiggleBracketsClosed) {
              ++i;
              finished = true;
              break;
            }
          } else if (lineText[i] === '}') {
            ++squiggleBracketsClosed;
          } else if (parenthesesOpened === parenthesesClosed && squiggleBracketsOpened === squiggleBracketsClosed) {
            if (lineText[i] === '$') {
              finished = true;
              break;
            } else if (lineText[i] === ';' || lineText[i] === '=') {
              ++i;
              finished = true;
              break;
            } else {
              scopeDescriptor = editor.scopeDescriptorForBufferPosition([line, i]).getScopeChain();
              if (scopeDescriptor.indexOf('.function.construct') > 0) {
                ++i;
                finished = true;
                break;
              }
            }
          }
          --i;
        }
        if (finished) {
          break;
        }
        --line;
      }
      textSlice = editor.getTextInBufferRange([[line, i], position]).trim();
      return this.parseStackClass(textSlice);
    },

    /**
     * Removes content inside parantheses (including nested parantheses).
     * @param {string}  text String to analyze.
     * @param {boolean} keep string inside parenthesis
     * @return String
     */
    stripParanthesesContent: function(text, keepString) {
      var closeCount, content, i, openCount, originalLength, reg, startIndex;
      i = 0;
      openCount = 0;
      closeCount = 0;
      startIndex = -1;
      while (i < text.length) {
        if (text[i] === '(') {
          ++openCount;
          if (openCount === 1) {
            startIndex = i;
          }
        } else if (text[i] === ')') {
          ++closeCount;
          if (closeCount === openCount) {
            originalLength = text.length;
            content = text.substring(startIndex, i + 1);
            reg = /["(][\s]*[\'\"][\s]*([^\"\']+)[\s]*[\"\'][\s]*[")]/g;
            if (openCount === 1 && reg.exec(content)) {
              continue;
            }
            text = text.substr(0, startIndex + 1) + text.substr(i, text.length);
            i -= originalLength - text.length;
            openCount = 0;
            closeCount = 0;
          }
        }
        ++i;
      }
      return text;
    },

    /**
     * Parse stack class elements
     * @param {string} text String of the stack class
     * @return Array
     */
    parseStackClass: function(text) {
      var element, elements, idx, key, matches, regx;
      regx = /\/\/.*\n/g;
      text = text.replace(regx, (function(_this) {
        return function(match) {
          return '';
        };
      })(this));
      regx = /\/\*[^(\*\/)]*\*\//g;
      text = text.replace(regx, (function(_this) {
        return function(match) {
          return '';
        };
      })(this));
      text = this.stripParanthesesContent(text, true);
      if (!text) {
        return [];
      }
      matches = text.match(/\(([^()]*|\(([^()]*|\([^()]*\))*\))*\)/g);
      elements = text.replace(/\(([^()]*|\(([^()]*|\([^()]*\))*\))*\)/g, '()').split(/(?:\-\>|::)/);
      idx = 0;
      for (key in elements) {
        element = elements[key];
        if (element.indexOf('()') !== -1) {
          elements[key] = element.replace(/\(\)/g, matches[idx]);
          idx += 1;
        }
      }
      if (elements.length === 1) {
        this.isFunction = true;
      } else {
        this.isFunction = false;
      }
      for (key in elements) {
        element = elements[key];
        element = element.replace(/^\s+|\s+$/g, "");
        if (element[0] === '{' || element[0] === '[') {
          element = element.substring(1);
        } else if (element.indexOf('return ') === 0) {
          element = element.substring('return '.length);
        }
        elements[key] = element;
      }
      return elements;
    },

    /**
     * Get the type of a variable
     *
     * @param {TextEditor} editor
     * @param {Range}      bufferPosition
     * @param {string}     element        Variable to search
     */
    getVariableType: function(editor, bufferPosition, element) {
      var bestMatch, bestMatchRow, chain, elements, funcName, line, lineNumber, matches, matchesCatch, matchesNew, newPosition, params, regexCatch, regexElement, regexFunction, regexNewInstance, regexVar, regexVarWithVarName, typeHint, value;
      if (element.replace(/[\$][a-zA-Z0-9_]+/g, "").trim().length > 0) {
        return null;
      }
      if (element.trim().length === 0) {
        return null;
      }
      bestMatch = null;
      bestMatchRow = null;
      regexElement = new RegExp("\\" + element + "[\\s]*=[\\s]*([^;]+);", "g");
      regexNewInstance = new RegExp("\\" + element + "[\\s]*=[\\s]*new[\\s]*\\\\?([a-zA-Z][a-zA-Z_\\\\]*)+(?:(.+)?);", "g");
      regexCatch = new RegExp("catch[\\s]*\\([\\s]*([A-Za-z0-9_\\\\]+)[\\s]+\\" + element + "[\\s]*\\)", "g");
      lineNumber = bufferPosition.row - 1;
      while (lineNumber > 0) {
        line = editor.lineTextForBufferRow(lineNumber);
        if (!bestMatch) {
          matchesNew = regexNewInstance.exec(line);
          if (null !== matchesNew) {
            bestMatchRow = lineNumber;
            bestMatch = this.getFullClassName(editor, matchesNew[1]);
          }
        }
        if (!bestMatch) {
          matchesCatch = regexCatch.exec(line);
          if (null !== matchesCatch) {
            bestMatchRow = lineNumber;
            bestMatch = this.getFullClassName(editor, matchesCatch[1]);
          }
        }
        if (!bestMatch) {
          matches = regexElement.exec(line);
          if (null !== matches) {
            value = matches[1];
            elements = this.parseStackClass(value);
            elements.push("");
            newPosition = {
              row: lineNumber,
              column: bufferPosition.column
            };
            bestMatchRow = lineNumber;
            bestMatch = this.parseElements(editor, newPosition, elements);
          }
        }
        if (!bestMatch) {
          regexFunction = new RegExp("function(?:[\\s]+([_a-zA-Z]+))?[\\s]*[\\(](?:(?![a-zA-Z\\_\\\\]*[\\s]*\\" + element + ").)*[,\\s]?([a-zA-Z\\_\\\\]*)[\\s]*\\" + element + "[a-zA-Z0-9\\s\\$\\\\,=\\\"\\\'\(\)]*[\\s]*[\\)]", "g");
          matches = regexFunction.exec(line);
          if (null !== matches) {
            typeHint = matches[2];
            if (typeHint.length > 0) {
              return this.getFullClassName(editor, typeHint);
            }
            funcName = matches[1];
            if (funcName && funcName.length > 0) {
              params = proxy.docParams(this.getFullClassName(editor), funcName);
              if ((params.params != null) && (params.params[element] != null)) {
                return this.getFullClassName(editor, params.params[element].type, true);
              }
            }
          }
        }
        chain = editor.scopeDescriptorForBufferPosition([lineNumber, line.length]).getScopeChain();
        if (chain.indexOf("comment") !== -1) {
          if (bestMatchRow && lineNumber === (bestMatchRow - 1)) {
            regexVar = /\@var[\s]+([a-zA-Z_\\]+)(?![\w]+\$)/g;
            matches = regexVar.exec(line);
            if (null !== matches) {
              return this.getFullClassName(editor, matches[1]);
            }
          }
          regexVarWithVarName = new RegExp("\\@var[\\s]+([a-zA-Z_\\\\]+)[\\s]+\\" + element, "g");
          matches = regexVarWithVarName.exec(line);
          if (null !== matches) {
            return this.getFullClassName(editor, matches[1]);
          }
          regexVarWithVarName = new RegExp("\\@var[\\s]+\\" + element + "[\\s]+([a-zA-Z_\\\\]+)", "g");
          matches = regexVarWithVarName.exec(line);
          if (null !== matches) {
            return this.getFullClassName(editor, matches[1]);
          }
        }
        if (chain.indexOf("function") !== -1) {
          break;
        }
        --lineNumber;
      }
      return bestMatch;
    },

    /**
     * Retrieves contextual information about the class member at the specified location in the editor.
     *
     * @param {TextEditor} editor         TextEditor to search for namespace of term.
     * @param {string}     term           Term to search for.
     * @param {Point}      bufferPosition The cursor location the term is at.
     * @param {Object}     calledClass    Information about the called class (optional).
     */
    getMemberContext: function(editor, term, bufferPosition, calledClass) {
      var j, len, methods, ref, val, value;
      if (!calledClass) {
        calledClass = this.getCalledClass(editor, term, bufferPosition);
      }
      if (!calledClass && !this.isFunction) {
        return;
      }
      proxy = require('../services/php-proxy.coffee');
      if (this.isFunction) {
        methods = proxy.functions();
      } else {
        methods = proxy.methods(calledClass);
      }
      if (!methods || (methods == null)) {
        return;
      }
      if ((methods.error != null) && methods.error !== '') {
        if (config.config.verboseErrors) {
          atom.notifications.addError('Failed to get methods for ' + calledClass, {
            'detail': methods.error.message
          });
        } else {
          console.log('Failed to get methods for ' + calledClass + ' : ' + methods.error.message);
        }
        return;
      }
      if (!((ref = methods.values) != null ? ref.hasOwnProperty(term) : void 0)) {
        return;
      }
      value = methods.values[term];
      if (value instanceof Array) {
        for (j = 0, len = value.length; j < len; j++) {
          val = value[j];
          if (val.isMethod) {
            value = val;
            break;
          }
        }
      }
      return value;
    },

    /**
     * Parse all elements from the given array to return the last className (if any)
     * @param  Array elements Elements to parse
     * @return string|null full class name of the last element
     */
    parseElements: function(editor, bufferPosition, elements) {
      var className, element, found, j, k, len, len1, loop_index, methods, plugin, ref;
      loop_index = 0;
      className = null;
      if (elements == null) {
        return;
      }
      for (j = 0, len = elements.length; j < len; j++) {
        element = elements[j];
        if (loop_index === 0) {
          if (element[0] === '$') {
            className = this.getVariableType(editor, bufferPosition, element);
            if (element === '$this' && !className) {
              className = this.getFullClassName(editor);
            }
            loop_index++;
            continue;
          } else if (element === 'static' || element === 'self') {
            className = this.getFullClassName(editor);
            loop_index++;
            continue;
          } else if (element === 'parent') {
            className = this.getParentClass(editor);
            loop_index++;
            continue;
          } else {
            className = this.getFullClassName(editor, element);
            loop_index++;
            continue;
          }
        }
        if (loop_index >= elements.length - 1) {
          break;
        }
        if (className === null) {
          break;
        }
        found = null;
        ref = plugins.plugins;
        for (k = 0, len1 = ref.length; k < len1; k++) {
          plugin = ref[k];
          if (plugin.autocomplete == null) {
            continue;
          }
          found = plugin.autocomplete(className, element);
          if (found) {
            break;
          }
        }
        if (found) {
          className = found;
        } else {
          methods = proxy.autocomplete(className, element);
          if ((methods["class"] == null) || !this.isClass(methods["class"])) {
            className = null;
            break;
          }
          className = methods["class"];
        }
        loop_index++;
      }
      if (elements.length > 0 && (elements[elements.length - 1].length === 0 || elements[elements.length - 1].match(/([a-zA-Z0-9]$)/g))) {
        return className;
      }
      return null;
    },

    /**
     * Gets the full words from the buffer position given.
     * E.g. Getting a class with its namespace.
     * @param  {TextEditor}     editor   TextEditor to search.
     * @param  {BufferPosition} position BufferPosition to start searching from.
     * @return {string}  Returns a string of the class.
     */
    getFullWordFromBufferPosition: function(editor, position) {
      var backwardRegex, currentText, endBufferPosition, forwardRegex, foundEnd, foundStart, index, previousText, range, startBufferPosition;
      foundStart = false;
      foundEnd = false;
      startBufferPosition = [];
      endBufferPosition = [];
      forwardRegex = /-|(?:\()[\w\[\$\(\\]|\s|\)|;|'|,|"|\|/;
      backwardRegex = /\(|\s|\)|;|'|,|"|\|/;
      index = -1;
      previousText = '';
      while (true) {
        index++;
        startBufferPosition = [position.row, position.column - index - 1];
        range = [[position.row, position.column], [startBufferPosition[0], startBufferPosition[1]]];
        currentText = editor.getTextInBufferRange(range);
        if (backwardRegex.test(editor.getTextInBufferRange(range)) || startBufferPosition[1] === -1 || currentText === previousText) {
          foundStart = true;
        }
        previousText = editor.getTextInBufferRange(range);
        if (foundStart) {
          break;
        }
      }
      index = -1;
      while (true) {
        index++;
        endBufferPosition = [position.row, position.column + index + 1];
        range = [[position.row, position.column], [endBufferPosition[0], endBufferPosition[1]]];
        currentText = editor.getTextInBufferRange(range);
        if (forwardRegex.test(currentText) || endBufferPosition[1] === 500 || currentText === previousText) {
          foundEnd = true;
        }
        previousText = editor.getTextInBufferRange(range);
        if (foundEnd) {
          break;
        }
      }
      startBufferPosition[1] += 1;
      endBufferPosition[1] -= 1;
      return editor.getTextInBufferRange([startBufferPosition, endBufferPosition]);
    },

    /**
     * Gets the correct selector when a class or namespace is clicked.
     *
     * @param  {jQuery.Event}  event  A jQuery event.
     *
     * @return {object|null} A selector to be used with jQuery.
     */
    getClassSelectorFromEvent: function(event) {
      var $, selector;
      selector = event.currentTarget;
      $ = require('jquery');
      if ($(selector).hasClass('builtin') || $(selector).children('.builtin').length > 0) {
        return null;
      }
      if ($(selector).parent().hasClass('function argument')) {
        return $(selector).parent().children('.namespace, .class:not(.operator):not(.constant)');
      }
      if ($(selector).prev().hasClass('namespace') && $(selector).hasClass('class')) {
        return $([$(selector).prev()[0], selector]);
      }
      if ($(selector).next().hasClass('class') && $(selector).hasClass('namespace')) {
        return $([selector, $(selector).next()[0]]);
      }
      if ($(selector).prev().hasClass('namespace') || $(selector).next().hasClass('inherited-class')) {
        return $(selector).parent().children('.namespace, .inherited-class');
      }
      return selector;
    },

    /**
     * Gets the parent class of the current class opened in the editor
     * @param  {TextEditor} editor Editor with the class in.
     * @return {string}            The namespace and class of the parent
     */
    getParentClass: function(editor) {
      var extendsIndex, j, len, line, lines, text, words;
      text = editor.getText();
      lines = text.split('\n');
      for (j = 0, len = lines.length; j < len; j++) {
        line = lines[j];
        line = line.trim();
        if (line.indexOf('extends ') !== -1) {
          words = line.split(' ');
          extendsIndex = words.indexOf('extends');
          return this.getFullClassName(editor, words[extendsIndex + 1]);
        }
      }
    },

    /**
     * Finds the buffer position of the word given
     * @param  {TextEditor} editor TextEditor to search
     * @param  {string}     term   The function name to search for
     * @return {mixed}             Either null or the buffer position of the function.
     */
    findBufferPositionOfWord: function(editor, term, regex, line) {
      var j, len, lineText, lines, result, row, text;
      if (line == null) {
        line = null;
      }
      if (line !== null) {
        lineText = editor.lineTextForBufferRow(line);
        result = this.checkLineForWord(lineText, term, regex);
        if (result !== null) {
          return [line, result];
        }
      } else {
        text = editor.getText();
        row = 0;
        lines = text.split('\n');
        for (j = 0, len = lines.length; j < len; j++) {
          line = lines[j];
          result = this.checkLineForWord(line, term, regex);
          if (result !== null) {
            return [row, result];
          }
          row++;
        }
      }
      return null;
    },

    /**
     * Checks the lineText for the term and regex matches
     * @param  {string}   lineText The line of text to check.
     * @param  {string}   term     Term to look for.
     * @param  {regex}    regex    Regex to run on the line to make sure it's valid
     * @return {null|int}          Returns null if nothing was found or an
     *                             int of the column the term is on.
     */
    checkLineForWord: function(lineText, term, regex) {
      var element, j, len, propertyIndex, reducedWords, words;
      if (regex.test(lineText)) {
        words = lineText.split(' ');
        propertyIndex = 0;
        for (j = 0, len = words.length; j < len; j++) {
          element = words[j];
          if (element.indexOf(term) !== -1) {
            break;
          }
          propertyIndex++;
        }
        reducedWords = words.slice(0, propertyIndex).join(' ');
        return reducedWords.length + 1;
      }
      return null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL2F0b20tYXV0b2NvbXBsZXRlLXBocC9saWIvc2VydmljZXMvcGhwLWZpbGUtcGFyc2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSw4QkFBUjs7RUFDUixNQUFBLEdBQVMsT0FBQSxDQUFRLGtCQUFSOztFQUNULE9BQUEsR0FBVSxPQUFBLENBQVEsbUNBQVI7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FDSTtJQUFBLG1CQUFBLEVBQXFCLGtEQUFyQjtJQUNBLGlCQUFBLEVBQW1CLG9FQURuQjtJQUlBLEtBQUEsRUFBTyxFQUpQO0lBT0EsVUFBQSxFQUFZLEtBUFo7O0FBU0E7Ozs7Ozs7Ozs7OztJQVlBLGNBQUEsRUFBZ0IsU0FBQyxNQUFELEVBQVMsSUFBVCxFQUFlLGNBQWY7QUFDWixVQUFBO01BQUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQWpCLEVBQXlCLGNBQXpCO01BRVgsd0JBQUcsUUFBUSxDQUFFLGdCQUFWLEtBQW9CLENBQXBCLElBQXlCLENBQUMsSUFBN0I7QUFDSSxlQURKOztBQUdBLGFBQU8sSUFBQyxDQUFBLGFBQUQsQ0FBZSxNQUFmLEVBQXVCLGNBQXZCLEVBQXVDLFFBQXZDO0lBTkssQ0FyQmhCOztBQTZCQTs7Ozs7SUFLQSx5QkFBQSxFQUEyQixTQUFDLE1BQUQsRUFBUyxjQUFUO0FBRXZCLFVBQUE7TUFBQSxZQUFBLEdBQWUsSUFBQyxDQUFBLFlBQUQsQ0FBYyxNQUFkLEVBQXNCLGNBQXRCO01BRWYsYUFBQSxHQUFnQjtNQUVoQixJQUFHLFlBQUg7UUFDSSxhQUFBLEdBQWdCLElBQUMsQ0FBQSxLQUFNLENBQUEsa0JBQUEsRUFEM0I7T0FBQSxNQUFBO1FBSUksYUFBQSxHQUFnQixDQUFDLENBQUQsRUFBSSxDQUFKLEVB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bEIsRUFBNEIsSUFBNUIsRUFBa0MsS0FBbEM7UUFDVCxJQUFHLE1BQUEsS0FBVSxJQUFiO0FBQ0ksaUJBQU8sQ0FBQyxJQUFELEVBQU8sTUFBUCxFQURYO1NBSEo7T0FBQSxNQUFBO1FBTUksSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUE7UUFDUCxHQUFBLEdBQU07UUFDTixLQUFBLEdBQVEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYO0FBQ1IsYUFBQSx1Q0FBQTs7VUFDSSxNQUFBLEdBQVMsSUFBQyxDQUFBLGdCQUFELENBQWtCLElBQWxCLEVBQXdCLElBQXhCLEVBQThCLEtBQTlCO1VBQ1QsSUFBRyxNQUFBLEtBQVUsSUFBYjtBQUNJLG1CQUFPLENBQUMsR0FBRCxFQUFNLE1BQU4sRUFEWDs7VUFFQSxHQUFBO0FBSkosU0FUSjs7QUFjQSxhQUFPO0lBZmUsQ0E3MkIxQjs7QUE4M0JBOzs7Ozs7OztJQVFBLGdCQUFBLEVBQWtCLFNBQUMsUUFBRCxFQUFXLElBQVgsRUFBaUIsS0FBakI7QUFDZCxVQUFBO01BQUEsSUFBRyxLQUFLLENBQUMsSUFBTixDQUFXLFFBQVgsQ0FBSDtRQUNJLEtBQUEsR0FBUSxRQUFRLENBQUMsS0FBVCxDQUFlLEdBQWY7UUFDUixhQUFBLEdBQWdCO0FBQ2hCLGFBQUEsdUNBQUE7O1VBQ0ksSUFBRyxPQUFPLENBQUMsT0FBUixDQUFnQixJQUFoQixDQUFBLEtBQXlCLENBQUMsQ0FBN0I7QUFDSSxrQkFESjs7VUFFQSxhQUFBO0FBSEo7UUFLRSxZQUFBLEdBQWUsS0FBSyxDQUFDLEtBQU4sQ0FBWSxDQUFaLEVBQWUsYUFBZixDQUE2QixDQUFDLElBQTlCLENBQW1DLEdBQW5DO0FBQ2YsZUFBTyxZQUFZLENBQUMsTUFBYixHQUFzQixFQVRuQzs7QUFVQSxhQUFPO0lBWE8sQ0F0NEJsQjs7QUFMSiIsInNvdXJjZXNDb250ZW50IjpbInByb3h5ID0gcmVxdWlyZSBcIi4uL3NlcnZpY2VzL3BocC1wcm94eS5jb2ZmZWVcIlxuY29uZmlnID0gcmVxdWlyZSBcIi4uL2NvbmZpZy5jb2ZmZWVcIlxucGx1Z2lucyA9IHJlcXVpcmUgXCIuLi9zZXJ2aWNlcy9wbHVnaW4tbWFuYWdlci5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gICAgc3RydWN0dXJlU3RhcnRSZWdleDogLyg/OmFic3RyYWN0IGNsYXNzfGNsYXNzfHRyYWl0fGludGVyZmFjZSlcXHMrKFxcdyspL1xuICAgIHVzZVN0YXRlbWVudFJlZ2V4OiAvKD86dXNlKSg/OlteXFx3XFxcXF0pKFtcXHdcXFxcXSspKD8hW1xcd1xcXFxdKSg/Oig/OlsgXSthc1sgXSspKFxcdyspKT8oPzo7KS9cblxuICAgICMgU2ltcGxlIGNhY2hlIHRvIGF2b2lkIGR1cGxpY2F0ZSBjb21wdXRhdGlvbiBmb3IgZWFjaCBwcm92aWRlcnNcbiAgICBjYWNoZTogW11cblxuICAgICMgaXMgYSBtZXRob2Qgb3IgYSBzaW1wbGUgZnVuY3Rpb25cbiAgICBpc0Z1bmN0aW9uOiBmYWxzZVxuXG4gICAgIyMjKlxuICAgICAqIFJldHJpZXZlcyB0aGUgY2xhc3MgdGhlIHNwZWNpZmllZCB0ZXJtIChtZXRob2Qgb3IgcHJvcGVydHkpIGlzIGJlaW5nIGludm9rZWQgb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtUZXh0RWRpdG9yfSBlZGl0b3IgICAgICAgICBUZXh0RWRpdG9yIHRvIHNlYXJjaCBmb3IgbmFtZXNwYWNlIG9mIHRlcm0uXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSAgICAgdGVybSAgICAgICAgICAgVGVybSB0byBzZWFyY2ggZm9yLlxuICAgICAqIEBwYXJhbSAge1BvaW50fSAgICAgIGJ1ZmZlclBvc2l0aW9uIFRoZSBjdXJzb3IgbG9jYXRpb24gdGhlIHRlcm0gaXMgYXQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICpcbiAgICAgKiBAZXhhbXBsZSBJbnZva2luZyBpdCBvbiBNeU1ldGhvZDo6Zm9vKCktPmJhcigpIHdpbGwgYXNrIHdoYXQgY2xhc3MgJ2JhcicgaXMgaW52b2tlZCBvbiwgd2hpY2ggd2lsbCB3aGF0ZXZlciB0eXBlXG4gICAgICogICAgICAgICAgZm9vIHJldHVybnMuXG4gICAgIyMjXG4gICAgZ2V0Q2FsbGVkQ2xhc3M6IChlZGl0b3IsIHRlcm0sIGJ1ZmZlclBvc2l0aW9uKSAtPlxuICAgICAgICBmdWxsQ2FsbCA9IEBnZXRTdGFja0NsYXNzZXMoZWRpdG9yLCBidWZmZXJQb3NpdGlvbilcblxuICAgICAgICBpZiBmdWxsQ2FsbD8ubGVuZ3RoID09IDAgb3IgIXRlcm1cbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHJldHVybiBAcGFyc2VFbGVtZW50cyhlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBmdWxsQ2FsbClcblxuICAgICMjIypcbiAgICAgKiBHZXQgYWxsIHZhcmlhYmxlcyBkZWNsYXJlZCBpbiB0aGUgY3VycmVudCBmdW5jdGlvblxuICAgICAqIEBwYXJhbSB7VGV4dEVkdXRpcn0gZWRpdG9yICAgICAgICAgQXRvbSB0ZXh0IGVkaXRvclxuICAgICAqIEBwYXJhbSB7UmFuZ2V9ICAgICAgYnVmZmVyUG9zaXRpb24gUG9zaXRpb24gb2YgdGhlIGN1cnJlbnQgYnVmZmVyXG4gICAgIyMjXG4gICAgZ2V0QWxsVmFyaWFibGVzSW5GdW5jdGlvbjogKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pIC0+XG4gICAgICAgICMgcmV0dXJuIGlmIG5vdCBAaXNJbkZ1bmN0aW9uKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pXG4gICAgICAgIGlzSW5GdW5jdGlvbiA9IEBpc0luRnVuY3Rpb24oZWRpdG9yLCBidWZmZXJQb3NpdGlvbilcblxuICAgICAgICBzdGFydFBvc2l0aW9uID0gbnVsbFxuXG4gICAgICAgIGlmIGlzSW5GdW5jdGlvblxuICAgICAgICAgICAgc3RhcnRQb3NpdGlvbiA9IEBjYWNoZVsnZnVuY3Rpb25Qb3NpdGlvbiddXG5cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhcnRQb3NpdGlvbiA9IFswLCAwXVxuXG4gICAgICAgIHRleHQgPSBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoW3N0YXJ0UG9zaXRpb24sIFtidWZmZXJQb3NpdGlvbi5yb3csIGJ1ZmZlclBvc2l0aW9uLmNvbHVtbi0xXV0pXG4gICAgICAgIHJlZ2V4ID0gLyhcXCRbYS16QS1aX10rKS9nXG5cbiAgICAgICAgbWF0Y2hlcyA9IHRleHQubWF0Y2gocmVnZXgpXG4gICAgICAgIHJldHVybiBbXSBpZiBub3QgbWF0Y2hlcz9cblxuICAgICAgICBpZiBpc0luRnVuY3Rpb25cbiAgICAgICAgICAgIG1hdGNoZXMucHVzaCBcIiR0aGlzXCJcblxuICAgICAgICByZXR1cm4gbWF0Y2hlc1xuXG4gICAgIyMjKlxuICAgICAqIFJldHJpZXZlcyB0aGUgZnVsbCBjbGFzcyBuYW1lLiBJZiB0aGUgY2xhc3MgbmFtZSBpcyBhIEZRQ04gKEZ1bGx5IFF1YWxpZmllZCBDbGFzcyBOYW1lKSwgaXQgYWxyZWFkeSBpcyBhIGZ1bGxcbiAgICAgKiBuYW1lIGFuZCBpdCBpcyByZXR1cm5lZCBhcyBpcy4gT3RoZXJ3aXNlLCB0aGUgY3VycmVudCBuYW1lc3BhY2UgYW5kIHVzZSBzdGF0ZW1lbnRzIGFyZSBzY2FubmVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtUZXh0RWRpdG9yfSAgZWRpdG9yICAgIFRleHQgZWRpdG9yIGluc3RhbmNlLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfG51bGx9IGNsYXNzTmFtZSBOYW1lIG9mIHRoZSBjbGFzcyB0byByZXRyaWV2ZSB0aGUgZnVsbCBuYW1lIG9mLiBJZiBudWxsLCB0aGUgY3VycmVudCBjbGFzcyB3aWxsXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlIHJldHVybmVkIChpZiBhbnkpLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gICAgIG5vQ3VycmVudCBEbyBub3QgdXNlIHRoZSBjdXJyZW50IGNsYXNzIGlmIGNsYXNzTmFtZSBpcyBlbXB0eVxuICAgICAqXG4gICAgICogQHJldHVybiBzdHJpbmdcbiAgICAjIyNcbiAgICBnZXRGdWxsQ2xhc3NOYW1lOiAoZWRpdG9yLCBjbGFzc05hbWUgPSBudWxsLCBub0N1cnJlbnQgPSBmYWxzZSkgLT5cbiAgICAgICAgaWYgY2xhc3NOYW1lID09IG51bGxcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9ICcnXG5cbiAgICAgICAgICAgIGlmIG5vQ3VycmVudFxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICAgaWYgY2xhc3NOYW1lIGFuZCBjbGFzc05hbWVbMF0gPT0gXCJcXFxcXCJcbiAgICAgICAgICAgIHJldHVybiBjbGFzc05hbWUuc3Vic3RyKDEpICMgRlFDTiwgbm90IHN1YmplY3QgdG8gYW55IGZ1cnRoZXIgY29udGV4dC5cblxuICAgICAgICB1c2VQYXR0ZXJuID0gL15bIFxcdF0qKD86dXNlKSg/OlteXFx3XFxcXFxcXFxdKShbXFx3XFxcXFxcXFxdKykoPyFbXFx3XFxcXFxcXFxdKSg/Oig/OlsgXSthc1sgXSspKFxcdyspKT8oPzo7KS9cbiAgICAgICAgbmFtZXNwYWNlUGF0dGVybiA9IC9eWyBcXHRdKig/Om5hbWVzcGFjZSkoPzpbXlxcd1xcXFxcXFxcXSkoW1xcd1xcXFxcXFxcXSspKD8hW1xcd1xcXFxcXFxcXSkoPzo7KS9cbiAgICAgICAgZGVmaW5pdGlvblBhdHRlcm4gPSAvXlsgXFx0XSooPzphYnN0cmFjdCBjbGFzc3xjbGFzc3x0cmFpdHxpbnRlcmZhY2UpXFxzKyhcXHcrKS9cblxuICAgICAgICB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKVxuXG4gICAgICAgIGxpbmVzID0gdGV4dC5zcGxpdCgnXFxuJylcbiAgICAgICAgZnVsbENsYXNzID0gY2xhc3NOYW1lXG5cbiAgICAgICAgZm91bmQgPSBmYWxzZVxuXG4gICAgICAgIGZvciBsaW5lLGkgaW4gbGluZXNcbiAgICAgICAgICAgIG1hdGNoZXMgPSBsaW5lLm1hdGNoKG5hbWVzcGFjZVBhdHRlcm4pXG5cbiAgICAgICAgICAgIGlmIG1hdGNoZXNcbiAgICAgICAgICAgICAgICBmdWxsQ2xhc3MgPSBtYXRjaGVzWzFdICsgJ1xcXFwnICsgY2xhc3NOYW1lXG5cbiAgICAgICAgICAgIGVsc2UgaWYgY2xhc3NOYW1lXG4gICAgICAgICAgICAgICAgbWF0Y2hlcyA9IGxpbmUubWF0Y2godXNlUGF0dGVybilcbiAgICAgICAgICAgICAgICBpZiBtYXRjaGVzXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZVBhcnRzID0gY2xhc3NOYW1lLnNwbGl0KCdcXFxcJylcbiAgICAgICAgICAgICAgICAgICAgaW1wb3J0TmFtZVBhcnRzID0gbWF0Y2hlc1sxXS5zcGxpdCgnXFxcXCcpXG5cbiAgICAgICAgICAgICAgICAgICAgaXNBbGlhc2VkSW1wb3J0ID0gaWYgbWF0Y2hlc1syXSB0aGVuIHRydWUgZWxzZSBmYWxzZVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIGNsYXNzTmFtZSA9PSBtYXRjaGVzWzFdXG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxsQ2xhc3MgPSBjbGFzc05hbWUgIyBBbHJlYWR5IGEgY29tcGxldGUgbmFtZVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGlzQWxpYXNlZEltcG9ydCBhbmQgbWF0Y2hlc1syXSA9PSBjbGFzc05hbWVQYXJ0c1swXSkgb3IgKCFpc0FsaWFzZWRJbXBvcnQgYW5kIGltcG9ydE5hbWVQYXJ0c1tpbXBvcnROYW1lUGFydHMubGVuZ3RoIC0gMV0gPT0gY2xhc3NOYW1lUGFydHNbMF0pXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWVcblxuICAgICAgICAgICAgICAgICAgICAgICAgZnVsbENsYXNzID0gbWF0Y2hlc1sxXVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lUGFydHMgPSBjbGFzc05hbWVQYXJ0c1sxIC4uIGNsYXNzTmFtZVBhcnRzLmxlbmd0aF1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNsYXNzTmFtZVBhcnRzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsbENsYXNzICs9ICdcXFxcJyArIGNsYXNzTmFtZVBhcnRzLmpvaW4oJ1xcXFwnKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuXG4gICAgICAgICAgICBtYXRjaGVzID0gbGluZS5tYXRjaChkZWZpbml0aW9uUGF0dGVybilcblxuICAgICAgICAgICAgaWYgbWF0Y2hlc1xuICAgICAgICAgICAgICAgIGlmIG5vdCBjbGFzc05hbWVcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIGZ1bGxDbGFzcyArPSBtYXRjaGVzWzFdXG5cbiAgICAgICAgICAgICAgICBicmVha1xuXG4gICAgICAgICMgSW4gdGhlIGNsYXNzIG1hcCwgY2xhc3NlcyBuZXZlciBoYXZlIGEgbGVhZGluZyBzbGFzaC4gVGhlIGxlYWRpbmcgc2xhc2ggb25seSBpbmRpY2F0ZXMgdGhhdCBpbXBvcnQgcnVsZXMgb2ZcbiAgICAgICAgIyB0aGUgZmlsZSBkb24ndCBhcHBseSwgYnV0IGl0J3MgdXNlbGVzcyBhZnRlciB0aGF0LlxuICAgICAgICBpZiBmdWxsQ2xhc3MgYW5kIGZ1bGxDbGFzc1swXSA9PSAnXFxcXCdcbiAgICAgICAgICAgIGZ1bGxDbGFzcyA9IGZ1bGxDbGFzcy5zdWJzdHIoMSlcblxuICAgICAgICBpZiBub3QgZm91bmRcbiAgICAgICAgICAgICMgQXQgdGhpcyBwb2ludCwgdGhpcyBjb3VsZCBlaXRoZXIgYmUgYSBjbGFzcyBuYW1lIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50IG5hbWVzcGFjZSBvciBhIGZ1bGwgY2xhc3MgbmFtZVxuICAgICAgICAgICAgIyB3aXRob3V0IGEgbGVhZGluZyBzbGFzaC4gRm9yIGV4YW1wbGUsIEZvb1xcQmFyIGNvdWxkIGFsc28gYmUgcmVsYXRpdmUgKGUuZy4gTXlcXEZvb1xcQmFyKSwgaW4gd2hpY2ggY2FzZSBpdHNcbiAgICAgICAgICAgICMgYWJzb2x1dGUgcGF0aCBpcyBkZXRlcm1pbmVkIGJ5IHRoZSBuYW1lc3BhY2UgYW5kIHVzZSBzdGF0ZW1lbnRzIG9mIHRoZSBmaWxlIGNvbnRhaW5pbmcgaXQuXG4gICAgICAgICAgICBtZXRob2RzUmVxdWVzdCA9IHByb3h5Lm1ldGhvZHMoZnVsbENsYXNzKVxuXG4gICAgICAgICAgICBpZiBub3QgbWV0aG9kc1JlcXVlc3Q/LmZpbGVuYW1lXG4gICAgICAgICAgICAgICAgIyBUaGUgY2xhc3MsIGUuZy4gTXlcXEZvb1xcQmFyLCBkaWRuJ3QgZXhpc3QuIFdlIGNhbiBvbmx5IGFzc3VtZSBpdHMgYW4gYWJzb2x1dGUgcGF0aCwgdXNpbmcgYSBuYW1lc3BhY2VcbiAgICAgICAgICAgICAgICAjIHNldCB1cCBpbiBjb21wb3Nlci5qc29uLCB3aXRob3V0IGEgbGVhZGluZyBzbGFzaC5cbiAgICAgICAgICAgICAgICBmdWxsQ2xhc3MgPSBjbGFzc05hbWVcblxuICAgICAgICByZXR1cm4gZnVsbENsYXNzXG5cbiAgICAjIyMqXG4gICAgICogQWRkIHRoZSB1c2UgZm9yIHRoZSBnaXZlbiBjbGFzcyBpZiBub3QgYWxyZWFkeSBhZGRlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7VGV4dEVkaXRvcn0gZWRpdG9yICAgICAgICAgICAgICAgICAgQXRvbSB0ZXh0IGVkaXRvci5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gICAgIGNsYXNzTmFtZSAgICAgICAgICAgICAgIE5hbWUgb2YgdGhlIGNsYXNzIHRvIGFkZC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59ICAgIGFsbG93QWRkaXRpb25hbE5ld2xpbmVzIFdoZXRoZXIgdG8gYWxsb3cgYWRkaW5nIGFkZGl0aW9uYWwgbmV3bGluZXMgdG8gYXR0ZW1wdCB0byBncm91cCB1c2VcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudHMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtpbnR9ICAgICAgIFRoZSBhbW91bnQgb2YgbGluZXMgYWRkZWQgKGluY2x1ZGluZyBuZXdsaW5lcyksIHNvIHlvdSBjYW4gcmVsaWFibHkgYW5kIGVhc2lseSBvZmZzZXQgeW91clxuICAgICAqICAgICAgICAgICAgICAgICAgICAgcm93cy4gVGhpcyBjb3VsZCBiZSB6ZXJvIGlmIGEgdXNlIHN0YXRlbWVudCB3YXMgYWxyZWFkeSBwcmVzZW50LlxuICAgICMjI1xuICAgIGFkZFVzZUNsYXNzOiAoZWRpdG9yLCBjbGFzc05hbWUsIGFsbG93QWRkaXRpb25hbE5ld2xpbmVzKSAtPlxuICAgICAgICBpZiBjbGFzc05hbWUuc3BsaXQoJ1xcXFwnKS5sZW5ndGggPT0gMSBvciBjbGFzc05hbWUuaW5kZXhPZignXFxcXCcpID09IDBcbiAgICAgICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICAgYmVzdFVzZSA9IDBcbiAgICAgICAgYmVzdFNjb3JlID0gMFxuICAgICAgICBwbGFjZUJlbG93ID0gdHJ1ZVxuICAgICAgICBkb05ld0xpbmUgPSB0cnVlXG4gICAgICAgIGxpbmVDb3VudCA9IGVkaXRvci5nZXRMaW5lQ291bnQoKVxuXG4gICAgICAgICMgRGV0ZXJtaW5lIGFuIGFwcHJvcHJpYXRlIGxvY2F0aW9uIHRvIHBsYWNlIHRoZSB1c2Ugc3RhdGVtZW50LlxuICAgICAgICBmb3IgaSBpbiBbMCAuLiBsaW5lQ291bnQgLSAxXVxuICAgICAgICAgICAgbGluZSA9IGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhpKS50cmltKClcblxuICAgICAgICAgICAgaWYgbGluZS5sZW5ndGggPT0gMFxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgICAgIHNjb3BlRGVzY3JpcHRvciA9IGVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihbaSwgbGluZS5sZW5ndGhdKS5nZXRTY29wZUNoYWluKClcblxuICAgICAgICAgICAgaWYgc2NvcGVEZXNjcmlwdG9yLmluZGV4T2YoJy5jb21tZW50JykgPj0gMFxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgICAgIGlmIGxpbmUubWF0Y2goQHN0cnVjdHVyZVN0YXJ0UmVnZXgpXG4gICAgICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICAgICAgaWYgbGluZS5pbmRleE9mKCduYW1lc3BhY2UgJykgPj0gMFxuICAgICAgICAgICAgICAgIGJlc3RVc2UgPSBpXG5cbiAgICAgICAgICAgIG1hdGNoZXMgPSBAdXNlU3RhdGVtZW50UmVnZXguZXhlYyhsaW5lKVxuXG4gICAgICAgICAgICBpZiBtYXRjaGVzPyBhbmQgbWF0Y2hlc1sxXT9cbiAgICAgICAgICAgICAgICBpZiBtYXRjaGVzWzFdID09IGNsYXNzTmFtZVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMFxuXG4gICAgICAgICAgICAgICAgc2NvcmUgPSBAc2NvcmVDbGFzc05hbWUoY2xhc3NOYW1lLCBtYXRjaGVzWzFdKVxuXG4gICAgICAgICAgICAgICAgaWYgc2NvcmUgPj0gYmVzdFNjb3JlXG4gICAgICAgICAgICAgICAgICAgIGJlc3RVc2UgPSBpXG4gICAgICAgICAgICAgICAgICAgIGJlc3RTY29yZSA9IHNjb3JlXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgQGRvU2hhcmVDb21tb25OYW1lc3BhY2VQcmVmaXgoY2xhc3NOYW1lLCBtYXRjaGVzWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgZG9OZXdMaW5lID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlQmVsb3cgPSBpZiBjbGFzc05hbWUubGVuZ3RoID49IG1hdGNoZXNbMV0ubGVuZ3RoIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXG5cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgZG9OZXdMaW5lID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VCZWxvdyA9IHRydWVcblxuICAgICAgICAjIEluc2VydCB0aGUgdXNlIHN0YXRlbWVudCBpdHNlbGYuXG4gICAgICAgIGxpbmVFbmRpbmcgPSBlZGl0b3IuZ2V0QnVmZmVyKCkubGluZUVuZGluZ0ZvclJvdygwKVxuXG4gICAgICAgIGlmIG5vdCBhbGxvd0FkZGl0aW9uYWxOZXdsaW5lc1xuICAgICAgICAgICAgZG9OZXdMaW5lID0gZmFsc2VcblxuICAgICAgICBpZiBub3QgbGluZUVuZGluZ1xuICAgICAgICAgICAgbGluZUVuZGluZyA9IFwiXFxuXCJcblxuICAgICAgICB0ZXh0VG9JbnNlcnQgPSAnJ1xuXG4gICAgICAgIGlmIGRvTmV3TGluZSBhbmQgcGxhY2VCZWxvd1xuICAgICAgICAgICAgdGV4dFRvSW5zZXJ0ICs9IGxpbmVFbmRpbmdcblxuICAgICAgICB0ZXh0VG9JbnNlcnQgKz0gXCJ1c2UgI3tjbGFzc05hbWV9O1wiICsgbGluZUVuZGluZ1xuXG4gICAgICAgIGlmIGRvTmV3TGluZSBhbmQgbm90IHBsYWNlQmVsb3dcbiAgICAgICAgICAgIHRleHRUb0luc2VydCArPSBsaW5lRW5kaW5nXG5cbiAgICAgICAgbGluZVRvSW5zZXJ0QXQgPSBiZXN0VXNlICsgKGlmIHBsYWNlQmVsb3cgdGhlbiAxIGVsc2UgMClcbiAgICAgICAgZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKFtbbGluZVRvSW5zZXJ0QXQsIDBdLCBbbGluZVRvSW5zZXJ0QXQsIDBdXSwgdGV4dFRvSW5zZXJ0KVxuXG4gICAgICAgIHJldHVybiAoMSArIChpZiBkb05ld0xpbmUgdGhlbiAxIGVsc2UgMCkpXG5cbiAgICAjIyMqXG4gICAgICogUmV0dXJucyBhIGJvb2xlYW4gaW5kaWNhdGluZyBpZiB0aGUgc3BlY2lmaWVkIGNsYXNzIG5hbWVzIHNoYXJlIGEgY29tbW9uIG5hbWVzcGFjZSBwcmVmaXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZmlyc3RDbGFzc05hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2Vjb25kQ2xhc3NOYW1lXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICMjI1xuICAgIGRvU2hhcmVDb21tb25OYW1lc3BhY2VQcmVmaXg6IChmaXJzdENsYXNzTmFtZSwgc2Vjb25kQ2xhc3NOYW1lKSAtPlxuICAgICAgICBmaXJzdENsYXNzTmFtZVBhcnRzID0gZmlyc3RDbGFzc05hbWUuc3BsaXQoJ1xcXFwnKVxuICAgICAgICBzZWNvbmRDbGFzc05hbWVQYXJ0cyA9IHNlY29uZENsYXNzTmFtZS5zcGxpdCgnXFxcXCcpXG5cbiAgICAgICAgZmlyc3RDbGFzc05hbWVQYXJ0cy5wb3AoKVxuICAgICAgICBzZWNvbmRDbGFzc05hbWVQYXJ0cy5wb3AoKVxuXG4gICAgICAgIHJldHVybiBpZiBmaXJzdENsYXNzTmFtZVBhcnRzLmpvaW4oJ1xcXFwnKSA9PSBzZWNvbmRDbGFzc05hbWVQYXJ0cy5qb2luKCdcXFxcJykgdGhlbiB0cnVlIGVsc2UgZmFsc2VcblxuXG4gICAgIyMjKlxuICAgICAqIFNjb3JlcyB0aGUgZmlyc3QgY2xhc3MgbmFtZSBhZ2FpbnN0IHRoZSBzZWNvbmQsIGluZGljYXRpbmcgaG93IG11Y2ggdGhleSAnbWF0Y2gnIGVhY2ggb3RoZXIuIFRoaXMgY2FuIGJlIHVzZWRcbiAgICAgKiB0byBlLmcuIGZpbmQgYW4gYXBwcm9wcmlhdGUgbG9jYXRpb24gdG8gcGxhY2UgYSBjbGFzcyBpbiBhbiBleGlzdGluZyBsaXN0IG9mIGNsYXNzZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZmlyc3RDbGFzc05hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2Vjb25kQ2xhc3NOYW1lXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtmbG9hdH1cbiAgICAjIyNcbiAgICBzY29yZUNsYXNzTmFtZTogKGZpcnN0Q2xhc3NOYW1lLCBzZWNvbmRDbGFzc05hbWUpIC0+XG4gICAgICAgIGZpcnN0Q2xhc3NOYW1lUGFydHMgPSBmaXJzdENsYXNzTmFtZS5zcGxpdCgnXFxcXCcpXG4gICAgICAgIHNlY29uZENsYXNzTmFtZVBhcnRzID0gc2Vjb25kQ2xhc3NOYW1lLnNwbGl0KCdcXFxcJylcblxuICAgICAgICBtYXhMZW5ndGggPSAwXG5cbiAgICAgICAgaWYgZmlyc3RDbGFzc05hbWVQYXJ0cy5sZW5ndGggPiBzZWNvbmRDbGFzc05hbWVQYXJ0cy5sZW5ndGhcbiAgICAgICAgICAgIG1heExlbmd0aCA9IHNlY29uZENsYXNzTmFtZVBhcnRzLmxlbmd0aFxuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG1heExlbmd0aCA9IGZpcnN0Q2xhc3NOYW1lUGFydHMubGVuZ3RoXG5cbiAgICAgICAgdG90YWxTY29yZSA9IDBcblxuICAgICAgICAjIE5PVEU6IFdlIGRvbid0IHNjb3JlIHRoZSBsYXN0IHBhcnQuXG4gICAgICAgIGZvciBpIGluIFswIC4uIG1heExlbmd0aCAtIDJdXG4gICAgICAgICAgICBpZiBmaXJzdENsYXNzTmFtZVBhcnRzW2ldID09IHNlY29uZENsYXNzTmFtZVBhcnRzW2ldXG4gICAgICAgICAgICAgICAgdG90YWxTY29yZSArPSAyXG5cbiAgICAgICAgaWYgQGRvU2hhcmVDb21tb25OYW1lc3BhY2VQcmVmaXgoZmlyc3RDbGFzc05hbWUsIHNlY29uZENsYXNzTmFtZSlcbiAgICAgICAgICAgIGlmIGZpcnN0Q2xhc3NOYW1lLmxlbmd0aCA9PSBzZWNvbmRDbGFzc05hbWUubGVuZ3RoXG4gICAgICAgICAgICAgICAgdG90YWxTY29yZSArPSAyXG5cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAjIFN0aWNrIGNsb3NlciB0byBpdGVtcyB0aGF0IGFyZSBzbWFsbGVyIGluIGxlbmd0aCB0aGFuIGl0ZW1zIHRoYXQgYXJlIGxhcmdlciBpbiBsZW5ndGguXG4gICAgICAgICAgICAgICAgdG90YWxTY29yZSAtPSAwLjAwMSAqIE1hdGguYWJzKHNlY29uZENsYXNzTmFtZS5sZW5ndGggLSBmaXJzdENsYXNzTmFtZS5sZW5ndGgpXG5cbiAgICAgICAgcmV0dXJuIHRvdGFsU2NvcmVcblxuICAgICMjIypcbiAgICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIG5hbWUgaXMgYSBjbGFzcyBvciBub3RcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9ICBuYW1lIE5hbWUgdG8gY2hlY2tcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICMjI1xuICAgIGlzQ2xhc3M6IChuYW1lKSAtPlxuICAgICAgICByZXR1cm4gbmFtZS5zdWJzdHIoMCwxKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zdWJzdHIoMSkgPT0gbmFtZVxuXG4gICAgIyMjKlxuICAgICAqIENoZWNrcyBpZiB0aGUgY3VycmVudCBidWZmZXIgaXMgaW4gYSBmdW5jdG9uIG9yIG5vdFxuICAgICAqIEBwYXJhbSB7VGV4dEVkaXRvcn0gZWRpdG9yICAgICAgICAgQXRvbSB0ZXh0IGVkaXRvclxuICAgICAqIEBwYXJhbSB7UmFuZ2V9ICAgICAgYnVmZmVyUG9zaXRpb24gUG9zaXRpb24gb2YgdGhlIGN1cnJlbnQgYnVmZmVyXG4gICAgICogQHJldHVybiBib29sXG4gICAgIyMjXG4gICAgaXNJbkZ1bmN0aW9uOiAoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikgLT5cbiAgICAgICAgdGV4dCA9IGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShbWzAsIDBdLCBidWZmZXJQb3NpdGlvbl0pXG5cbiAgICAgICAgIyBJZiBsYXN0IHJlcXVlc3Qgd2FzIHRoZSBzYW1lXG4gICAgICAgIGlmIEBjYWNoZVt0ZXh0XT9cbiAgICAgICAgICByZXR1cm4gQGNhY2hlW3RleHRdXG5cbiAgICAgICAgIyBSZWluaXRpYWxpemUgY3VycmVudCBjYWNoZVxuICAgICAgICBAY2FjaGUgPSBbXVxuXG4gICAgICAgIHJvdyA9IGJ1ZmZlclBvc2l0aW9uLnJvd1xuICAgICAgICByb3dzID0gdGV4dC5zcGxpdCgnXFxuJylcblxuICAgICAgICBvcGVuZWRCbG9ja3MgPSAwXG4gICAgICAgIGNsb3NlZEJsb2NrcyA9IDBcblxuICAgICAgICByZXN1bHQgPSBmYWxzZVxuXG4gICAgICAgICMgZm9yIGVhY2ggcm93XG4gICAgICAgIHdoaWxlIHJvdyAhPSAtMVxuICAgICAgICAgICAgbGluZSA9IHJvd3Nbcm93XVxuXG4gICAgICAgICAgICAjIGlzc3VlICM2MVxuICAgICAgICAgICAgaWYgbm90IGxpbmVcbiAgICAgICAgICAgICAgICByb3ctLVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgICAgIGNoYXJhY3RlciA9IDBcbiAgICAgICAgICAgIGxpbmVMZW5ndGggPSBsaW5lLmxlbmd0aFxuICAgICAgICAgICAgbGFzdENoYWluID0gbnVsbFxuXG4gICAgICAgICAgICAjIFNjYW4gdGhlIGVudGlyZSBsaW5lLCBmZXRjaGluZyB0aGUgc2NvcGUgZm9yIGVhY2ggY2hhcmFjdGVyIHBvc2l0aW9uIGFzIG9uZSBsaW5lIGNhbiBjb250YWluIGJvdGggYSBzY29wZSBzdGFydFxuICAgICAgICAgICAgIyBhbmQgZW5kIHN1Y2ggYXMgXCJ9IGVsc2VpZiAodHJ1ZSkge1wiLiBIZXJlIHRoZSBzY29wZSBkZXNjcmlwdG9yIHdpbGwgZGlmZmVyIGZvciBkaWZmZXJlbnQgY2hhcmFjdGVyIHBvc2l0aW9ucyBvblxuICAgICAgICAgICAgIyB0aGUgbGluZS5cbiAgICAgICAgICAgIHdoaWxlIGNoYXJhY3RlciA8PSBsaW5lLmxlbmd0aFxuICAgICAgICAgICAgICAgICMgR2V0IGNoYWluIG9mIGFsbCBzY29wZXNcbiAgICAgICAgICAgICAgICBjaGFpbiA9IGVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihbcm93LCBjaGFyYWN0ZXJdKS5nZXRTY29wZUNoYWluKClcblxuICAgICAgICAgICAgICAgICMgTk9URTogQXRvbSBxdWlyazogYm90aCBsaW5lLmxlbmd0aCBhbmQgbGluZS5sZW5ndGggLSAxIHJldHVybiB0aGUgc2FtZSBzY29wZSBkZXNjcmlwdG9yLCBCVVQgeW91IGNhbid0IHNraXBcbiAgICAgICAgICAgICAgICAjIHNjYW5uaW5nIGxpbmUubGVuZ3RoIGFzIHNvbWV0aW1lcyBsaW5lLmxlbmd0aCAtIDEgZG9lcyBub3QgcmV0dXJuIGEgc2NvcGUgZGVzY3JpcHRvciBhdCBhbGwuXG4gICAgICAgICAgICAgICAgaWYgbm90IChjaGFyYWN0ZXIgPT0gbGluZS5sZW5ndGggYW5kIGNoYWluID09IGxhc3RDaGFpbilcbiAgICAgICAgICAgICAgICAgICAgIyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIGNoYWluLmluZGV4T2YoXCJzY29wZS5lbmRcIikgIT0gLTFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlZEJsb2NrcysrXG4gICAgICAgICAgICAgICAgICAgICMge1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIGNoYWluLmluZGV4T2YoXCJzY29wZS5iZWdpblwiKSAhPSAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmVkQmxvY2tzKytcblxuICAgICAgICAgICAgICAgIGxhc3RDaGFpbiA9IGNoYWluXG4gICAgICAgICAgICAgICAgY2hhcmFjdGVyKytcblxuICAgICAgICAgICAgIyBHZXQgY2hhaW4gb2YgYWxsIHNjb3Blc1xuICAgICAgICAgICAgY2hhaW4gPSBlZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24oW3JvdywgbGluZS5sZW5ndGhdKS5nZXRTY29wZUNoYWluKClcblxuICAgICAgICAgICAgIyBmdW5jdGlvblxuICAgICAgICAgICAgaWYgY2hhaW4uaW5kZXhPZihcImZ1bmN0aW9uXCIpICE9IC0xXG4gICAgICAgICAgICAgICAgIyBJZiBtb3JlIG9wZW5lZGJsb2NrcyB0aGFuIGNsb3NlZGJsb2Nrcywgd2UgYXJlIGluIGEgZnVuY3Rpb24uIE90aGVyd2lzZSwgY291bGQgYmUgYSBjbG9zdXJlLCBjb250aW51ZSBsb29raW5nLlxuICAgICAgICAgICAgICAgIGlmIG9wZW5lZEJsb2NrcyA+IGNsb3NlZEJsb2Nrc1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIEBjYWNoZVtcImZ1bmN0aW9uUG9zaXRpb25cIl0gPSBbcm93LCAwXVxuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgICAgIHJvdy0tXG5cbiAgICAgICAgQGNhY2hlW3RleHRdID0gcmVzdWx0XG4gICAgICAgIHJldHVybiByZXN1bHRcblxuICAgICMjIypcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIHN0YWNrIG9mIGVsZW1lbnRzIGluIGEgc3RhY2sgb2YgY2FsbHMgc3VjaCBhcyBcInNlbGY6Onh4eC0+eHh4eFwiLlxuICAgICAqXG4gICAgICogQHBhcmFtICB7VGV4dEVkaXRvcn0gZWRpdG9yXG4gICAgICogQHBhcmFtICB7UG9pbnR9ICAgICAgIHBvc2l0aW9uXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgIyMjXG4gICAgZ2V0U3RhY2tDbGFzc2VzOiAoZWRpdG9yLCBwb3NpdGlvbikgLT5cbiAgICAgICAgcmV0dXJuIHVubGVzcyBwb3NpdGlvbj9cblxuICAgICAgICBsaW5lID0gcG9zaXRpb24ucm93XG5cbiAgICAgICAgZmluaXNoZWQgPSBmYWxzZVxuICAgICAgICBwYXJlbnRoZXNlc09wZW5lZCA9IDBcbiAgICAgICAgcGFyZW50aGVzZXNDbG9zZWQgPSAwXG4gICAgICAgIHNxdWlnZ2xlQnJhY2tldHNPcGVuZWQgPSAwXG4gICAgICAgIHNxdWlnZ2xlQnJhY2tldHNDbG9zZWQgPSAwXG5cbiAgICAgICAgd2hpbGUgbGluZSA+IDBcbiAgICAgICAgICAgIGxpbmVUZXh0ID0gZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KGxpbmUpXG4gICAgICAgICAgICByZXR1cm4gdW5sZXNzIGxpbmVUZXh0XG5cbiAgICAgICAgICAgIGlmIGxpbmUgIT0gcG9zaXRpb24ucm93XG4gICAgICAgICAgICAgICAgaSA9IChsaW5lVGV4dC5sZW5ndGggLSAxKVxuXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgaSA9IHBvc2l0aW9uLmNvbHVtbiAtIDFcblxuICAgICAgICAgICAgd2hpbGUgaSA+PSAwXG4gICAgICAgICAgICAgICAgaWYgbGluZVRleHRbaV0gPT0gJygnXG4gICAgICAgICAgICAgICAgICAgICsrcGFyZW50aGVzZXNPcGVuZWRcblxuICAgICAgICAgICAgICAgICAgICAjIFRpY2tldCAjMTY0IC0gV2UncmUgd2Fsa2luZyBiYWNrd2FyZHMsIGlmIHdlIGZpbmQgYW4gb3BlbmluZyBwYXJhbnRoZXNpcyB0aGF0IGhhc24ndCBiZWVuIGNsb3NlZFxuICAgICAgICAgICAgICAgICAgICAjIGFueXdoZXJlLCB3ZSBrbm93IHdlIG11c3Qgc3RvcC5cbiAgICAgICAgICAgICAgICAgICAgaWYgcGFyZW50aGVzZXNPcGVuZWQgPiBwYXJlbnRoZXNlc0Nsb3NlZFxuICAgICAgICAgICAgICAgICAgICAgICAgKytpXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5pc2hlZCA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgICAgICAgICBlbHNlIGlmIGxpbmVUZXh0W2ldID09ICcpJ1xuICAgICAgICAgICAgICAgICAgICArK3BhcmVudGhlc2VzQ2xvc2VkXG5cbiAgICAgICAgICAgICAgICBlbHNlIGlmIGxpbmVUZXh0W2ldID09ICd7J1xuICAgICAgICAgICAgICAgICAgICArK3NxdWlnZ2xlQnJhY2tldHNPcGVuZWRcblxuICAgICAgICAgICAgICAgICAgICAjIFNhbWUgYXMgYWJvdmUuXG4gICAgICAgICAgICAgICAgICAgIGlmIHNxdWlnZ2xlQnJhY2tldHNPcGVuZWQgPiBzcXVpZ2dsZUJyYWNrZXRzQ2xvc2VkXG4gICAgICAgICAgICAgICAgICAgICAgICArK2lcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmlzaGVkID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICAgICAgICAgIGVsc2UgaWYgbGluZVRleHRbaV0gPT0gJ30nXG4gICAgICAgICAgICAgICAgICAgICsrc3F1aWdnbGVCcmFja2V0c0Nsb3NlZFxuXG4gICAgICAgICAgICAgICAgIyBUaGVzZSB3aWxsIG5vdCBiZSB0aGUgc2FtZSBpZiwgZm9yIGV4YW1wbGUsIHdlJ3ZlIGVudGVyZWQgYSBjbG9zdXJlLlxuICAgICAgICAgICAgICAgIGVsc2UgaWYgcGFyZW50aGVzZXNPcGVuZWQgPT0gcGFyZW50aGVzZXNDbG9zZWQgYW5kIHNxdWlnZ2xlQnJhY2tldHNPcGVuZWQgPT0gc3F1aWdnbGVCcmFja2V0c0Nsb3NlZFxuICAgICAgICAgICAgICAgICAgICAjIFZhcmlhYmxlIGRlZmluaXRpb24uXG4gICAgICAgICAgICAgICAgICAgIGlmIGxpbmVUZXh0W2ldID09ICckJ1xuICAgICAgICAgICAgICAgICAgICAgICAgZmluaXNoZWQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgbGluZVRleHRbaV0gPT0gJzsnIG9yIGxpbmVUZXh0W2ldID09ICc9J1xuICAgICAgICAgICAgICAgICAgICAgICAgKytpXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5pc2hlZCA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGVEZXNjcmlwdG9yID0gZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKFtsaW5lLCBpXSkuZ2V0U2NvcGVDaGFpbigpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICMgTGFuZ3VhZ2UgY29uc3RydWN0cywgc3VjaCBhcyBlY2hvIGFuZCBwcmludCwgZG9uJ3QgcmVxdWlyZSBwYXJhbnRoZXNlcy5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIHNjb3BlRGVzY3JpcHRvci5pbmRleE9mKCcuZnVuY3Rpb24uY29uc3RydWN0JykgPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKytpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluaXNoZWQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICAgICAgICAgIC0taVxuXG4gICAgICAgICAgICBpZiBmaW5pc2hlZFxuICAgICAgICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgICAgIC0tbGluZVxuXG4gICAgICAgICMgRmV0Y2ggZXZlcnl0aGluZyB3ZSByYW4gdGhyb3VnaCB1cCB1bnRpbCB0aGUgbG9jYXRpb24gd2Ugc3RhcnRlZCBmcm9tLlxuICAgICAgICB0ZXh0U2xpY2UgPSBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoW1tsaW5lLCBpXSwgcG9zaXRpb25dKS50cmltKClcblxuICAgICAgICByZXR1cm4gQHBhcnNlU3RhY2tDbGFzcyh0ZXh0U2xpY2UpXG5cbiAgICAjIyMqXG4gICAgICogUmVtb3ZlcyBjb250ZW50IGluc2lkZSBwYXJhbnRoZXNlcyAoaW5jbHVkaW5nIG5lc3RlZCBwYXJhbnRoZXNlcykuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9ICB0ZXh0IFN0cmluZyB0byBhbmFseXplLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0ga2VlcCBzdHJpbmcgaW5zaWRlIHBhcmVudGhlc2lzXG4gICAgICogQHJldHVybiBTdHJpbmdcbiAgICAjIyNcbiAgICBzdHJpcFBhcmFudGhlc2VzQ29udGVudDogKHRleHQsIGtlZXBTdHJpbmcpIC0+XG4gICAgICAgIGkgPSAwXG4gICAgICAgIG9wZW5Db3VudCA9IDBcbiAgICAgICAgY2xvc2VDb3VudCA9IDBcbiAgICAgICAgc3RhcnRJbmRleCA9IC0xXG5cbiAgICAgICAgd2hpbGUgaSA8IHRleHQubGVuZ3RoXG4gICAgICAgICAgICBpZiB0ZXh0W2ldID09ICcoJ1xuICAgICAgICAgICAgICAgICsrb3BlbkNvdW50XG5cbiAgICAgICAgICAgICAgICBpZiBvcGVuQ291bnQgPT0gMVxuICAgICAgICAgICAgICAgICAgICBzdGFydEluZGV4ID0gaVxuXG4gICAgICAgICAgICBlbHNlIGlmIHRleHRbaV0gPT0gJyknXG4gICAgICAgICAgICAgICAgKytjbG9zZUNvdW50XG5cbiAgICAgICAgICAgICAgICBpZiBjbG9zZUNvdW50ID09IG9wZW5Db3VudFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbExlbmd0aCA9IHRleHQubGVuZ3RoXG5cbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IHRleHQuc3Vic3RyaW5nKHN0YXJ0SW5kZXgsIGkrMSlcbiAgICAgICAgICAgICAgICAgICAgcmVnID0gL1tcIihdW1xcc10qW1xcJ1xcXCJdW1xcc10qKFteXFxcIlxcJ10rKVtcXHNdKltcXFwiXFwnXVtcXHNdKltcIildL2dcblxuICAgICAgICAgICAgICAgICAgICBpZiBvcGVuQ291bnQgPT0gMSBhbmQgcmVnLmV4ZWMoY29udGVudClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgICAgICAgICAgICAgdGV4dCA9IHRleHQuc3Vic3RyKDAsIHN0YXJ0SW5kZXggKyAxKSArIHRleHQuc3Vic3RyKGksIHRleHQubGVuZ3RoKTtcblxuICAgICAgICAgICAgICAgICAgICBpIC09IChvcmlnaW5hbExlbmd0aCAtIHRleHQubGVuZ3RoKVxuXG4gICAgICAgICAgICAgICAgICAgIG9wZW5Db3VudCA9IDBcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VDb3VudCA9IDBcblxuICAgICAgICAgICAgKytpXG5cbiAgICAgICAgcmV0dXJuIHRleHRcblxuICAgICMjIypcbiAgICAgKiBQYXJzZSBzdGFjayBjbGFzcyBlbGVtZW50c1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFN0cmluZyBvZiB0aGUgc3RhY2sgY2xhc3NcbiAgICAgKiBAcmV0dXJuIEFycmF5XG4gICAgIyMjXG4gICAgcGFyc2VTdGFja0NsYXNzOiAodGV4dCkgLT5cbiAgICAgICAgIyBSZW1vdmUgc2luZ2UgbGluZSBjb21tZW50c1xuICAgICAgICByZWd4ID0gL1xcL1xcLy4qXFxuL2dcbiAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSByZWd4LCAobWF0Y2gpID0+XG4gICAgICAgICAgICByZXR1cm4gJydcblxuICAgICAgICAjIFJlbW92ZSBtdWx0aSBsaW5lIGNvbW1lbnRzXG4gICAgICAgIHJlZ3ggPSAvXFwvXFwqW14oXFwqXFwvKV0qXFwqXFwvL2dcbiAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSByZWd4LCAobWF0Y2gpID0+XG4gICAgICAgICAgICByZXR1cm4gJydcblxuICAgICAgICAjIFJlbW92ZSBjb250ZW50IGluc2lkZSBwYXJhbnRoZXNlcyAoaW5jbHVkaW5nIG5lc3RlZCBwYXJhbnRoZXNlcykuXG4gICAgICAgIHRleHQgPSBAc3RyaXBQYXJhbnRoZXNlc0NvbnRlbnQodGV4dCwgdHJ1ZSlcblxuICAgICAgICAjIEdldCB0aGUgZnVsbCB0ZXh0XG4gICAgICAgIHJldHVybiBbXSBpZiBub3QgdGV4dFxuXG4gICAgICAgICMgS2VlcCB0aGUgY29udGVudCBvZiB0aGUgcGFyZW50aGVzaXMsIHRoZW4gZXJhc2UgaXQgdG8gc3BsaXRcbiAgICAgICAgbWF0Y2hlcyA9IHRleHQubWF0Y2goL1xcKChbXigpXSp8XFwoKFteKCldKnxcXChbXigpXSpcXCkpKlxcKSkqXFwpL2cpXG4gICAgICAgIGVsZW1lbnRzID0gdGV4dC5yZXBsYWNlKC9cXCgoW14oKV0qfFxcKChbXigpXSp8XFwoW14oKV0qXFwpKSpcXCkpKlxcKS9nLCAnKCknKS5zcGxpdCgvKD86XFwtXFw+fDo6KS8pXG5cbiAgICAgICAgIyBUaGVuLCBwdXQgdGhlIGNvbnRlbnQgYWdhaW5cbiAgICAgICAgaWR4ID0gMFxuICAgICAgICBmb3Iga2V5LCBlbGVtZW50IG9mIGVsZW1lbnRzXG4gICAgICAgICAgICBpZiBlbGVtZW50LmluZGV4T2YoJygpJykgIT0gLTFcbiAgICAgICAgICAgICAgICBlbGVtZW50c1trZXldID0gZWxlbWVudC5yZXBsYWNlIC9cXChcXCkvZywgbWF0Y2hlc1tpZHhdXG4gICAgICAgICAgICAgICAgaWR4ICs9IDFcblxuICAgICAgICBpZiBlbGVtZW50cy5sZW5ndGggPT0gMVxuICAgICAgICAgIEBpc0Z1bmN0aW9uID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQGlzRnVuY3Rpb24gPSBmYWxzZVxuXG4gICAgICAgICMgUmVtb3ZlIHBhcmVudGhlc2lzIGFuZCB3aGl0ZXNwYWNlc1xuICAgICAgICBmb3Iga2V5LCBlbGVtZW50IG9mIGVsZW1lbnRzXG4gICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5yZXBsYWNlIC9eXFxzK3xcXHMrJC9nLCBcIlwiXG4gICAgICAgICAgICBpZiBlbGVtZW50WzBdID09ICd7JyBvciBlbGVtZW50WzBdID09ICdbJ1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnN1YnN0cmluZygxKVxuICAgICAgICAgICAgZWxzZSBpZiBlbGVtZW50LmluZGV4T2YoJ3JldHVybiAnKSA9PSAwXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQuc3Vic3RyaW5nKCdyZXR1cm4gJy5sZW5ndGgpXG5cbiAgICAgICAgICAgIGVsZW1lbnRzW2tleV0gPSBlbGVtZW50XG5cbiAgICAgICAgcmV0dXJuIGVsZW1lbnRzXG5cbiAgICAjIyMqXG4gICAgICogR2V0IHRoZSB0eXBlIG9mIGEgdmFyaWFibGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7VGV4dEVkaXRvcn0gZWRpdG9yXG4gICAgICogQHBhcmFtIHtSYW5nZX0gICAgICBidWZmZXJQb3NpdGlvblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSAgICAgZWxlbWVudCAgICAgICAgVmFyaWFibGUgdG8gc2VhcmNoXG4gICAgIyMjXG4gICAgZ2V0VmFyaWFibGVUeXBlOiAoZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgZWxlbWVudCkgLT5cbiAgICAgICAgaWYgZWxlbWVudC5yZXBsYWNlKC9bXFwkXVthLXpBLVowLTlfXSsvZywgXCJcIikudHJpbSgpLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICAgaWYgZWxlbWVudC50cmltKCkubGVuZ3RoID09IDBcbiAgICAgICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICAgYmVzdE1hdGNoID0gbnVsbFxuICAgICAgICBiZXN0TWF0Y2hSb3cgPSBudWxsXG5cbiAgICAgICAgIyBSZWdleCB2YXJpYWJsZSBkZWZpbml0aW9uXG4gICAgICAgIHJlZ2V4RWxlbWVudCA9IG5ldyBSZWdFeHAoXCJcXFxcI3tlbGVtZW50fVtcXFxcc10qPVtcXFxcc10qKFteO10rKTtcIiwgXCJnXCIpXG4gICAgICAgIHJlZ2V4TmV3SW5zdGFuY2UgPSBuZXcgUmVnRXhwKFwiXFxcXCN7ZWxlbWVudH1bXFxcXHNdKj1bXFxcXHNdKm5ld1tcXFxcc10qXFxcXFxcXFw/KFthLXpBLVpdW2EtekEtWl9cXFxcXFxcXF0qKSsoPzooLispPyk7XCIsIFwiZ1wiKVxuICAgICAgICByZWdleENhdGNoID0gbmV3IFJlZ0V4cChcImNhdGNoW1xcXFxzXSpcXFxcKFtcXFxcc10qKFtBLVphLXowLTlfXFxcXFxcXFxdKylbXFxcXHNdK1xcXFwje2VsZW1lbnR9W1xcXFxzXSpcXFxcKVwiLCBcImdcIilcblxuICAgICAgICBsaW5lTnVtYmVyID0gYnVmZmVyUG9zaXRpb24ucm93IC0gMVxuXG4gICAgICAgIHdoaWxlIGxpbmVOdW1iZXIgPiAwXG4gICAgICAgICAgICBsaW5lID0gZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KGxpbmVOdW1iZXIpXG5cbiAgICAgICAgICAgIGlmIG5vdCBiZXN0TWF0Y2hcbiAgICAgICAgICAgICAgICAjIENoZWNrIGZvciAkeCA9IG5ldyBYWFhYWCgpXG4gICAgICAgICAgICAgICAgbWF0Y2hlc05ldyA9IHJlZ2V4TmV3SW5zdGFuY2UuZXhlYyhsaW5lKVxuXG4gICAgICAgICAgICAgICAgaWYgbnVsbCAhPSBtYXRjaGVzTmV3XG4gICAgICAgICAgICAgICAgICAgIGJlc3RNYXRjaFJvdyA9IGxpbmVOdW1iZXJcbiAgICAgICAgICAgICAgICAgICAgYmVzdE1hdGNoID0gQGdldEZ1bGxDbGFzc05hbWUoZWRpdG9yLCBtYXRjaGVzTmV3WzFdKVxuXG4gICAgICAgICAgICBpZiBub3QgYmVzdE1hdGNoXG4gICAgICAgICAgICAgICAgIyBDaGVjayBmb3IgY2F0Y2goWFhYICR4eHgpXG4gICAgICAgICAgICAgICAgbWF0Y2hlc0NhdGNoID0gcmVnZXhDYXRjaC5leGVjKGxpbmUpXG5cbiAgICAgICAgICAgICAgICBpZiBudWxsICE9IG1hdGNoZXNDYXRjaFxuICAgICAgICAgICAgICAgICAgICBiZXN0TWF0Y2hSb3cgPSBsaW5lTnVtYmVyXG4gICAgICAgICAgICAgICAgICAgIGJlc3RNYXRjaCA9IEBnZXRGdWxsQ2xhc3NOYW1lKGVkaXRvciwgbWF0Y2hlc0NhdGNoWzFdKVxuXG4gICAgICAgICAgICBpZiBub3QgYmVzdE1hdGNoXG4gICAgICAgICAgICAgICAgIyBDaGVjayBmb3IgYSB2YXJpYWJsZSBhc3NpZ25tZW50ICR4ID0gLi4uXG4gICAgICAgICAgICAgICAgbWF0Y2hlcyA9IHJlZ2V4RWxlbWVudC5leGVjKGxpbmUpXG5cbiAgICAgICAgICAgICAgICBpZiBudWxsICE9IG1hdGNoZXNcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBtYXRjaGVzWzFdXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzID0gQHBhcnNlU3RhY2tDbGFzcyh2YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaChcIlwiKSAjwqBQdXNoIG9uZSBtb3JlIGVsZW1lbnQgdG8gZ2V0IGZ1bGx5IHRoZSBsYXN0IGNsYXNzXG5cbiAgICAgICAgICAgICAgICAgICAgbmV3UG9zaXRpb24gPVxuICAgICAgICAgICAgICAgICAgICAgICAgcm93IDogbGluZU51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uOiBidWZmZXJQb3NpdGlvbi5jb2x1bW5cblxuICAgICAgICAgICAgICAgICAgICAjIE5PVEU6IGJlc3RNYXRjaCBjb3VsZCBub3cgYmUgbnVsbCwgYnV0IHRoaXMgbGluZSBpcyBzdGlsbCB0aGUgY2xvc2VzdCBtYXRjaC4gVGhlIGZhY3QgdGhhdCB3ZVxuICAgICAgICAgICAgICAgICAgICAjIGRvbid0IHJlY29nbml6ZSB0aGUgY2xhc3MgbmFtZSBpcyBpcnJlbGV2YW50LlxuICAgICAgICAgICAgICAgICAgICBiZXN0TWF0Y2hSb3cgPSBsaW5lTnVtYmVyXG4gICAgICAgICAgICAgICAgICAgIGJlc3RNYXRjaCA9IEBwYXJzZUVsZW1lbnRzKGVkaXRvciwgbmV3UG9zaXRpb24sIGVsZW1lbnRzKVxuXG4gICAgICAgICAgICBpZiBub3QgYmVzdE1hdGNoXG4gICAgICAgICAgICAgICAgIyBDaGVjayBmb3IgZnVuY3Rpb24gb3IgY2xvc3VyZSBwYXJhbWV0ZXIgdHlwZSBoaW50cyBhbmQgdGhlIGRvY2Jsb2NrLlxuICAgICAgICAgICAgICAgIHJlZ2V4RnVuY3Rpb24gPSBuZXcgUmVnRXhwKFwiZnVuY3Rpb24oPzpbXFxcXHNdKyhbX2EtekEtWl0rKSk/W1xcXFxzXSpbXFxcXChdKD86KD8hW2EtekEtWlxcXFxfXFxcXFxcXFxdKltcXFxcc10qXFxcXCN7ZWxlbWVudH0pLikqWyxcXFxcc10/KFthLXpBLVpcXFxcX1xcXFxcXFxcXSopW1xcXFxzXSpcXFxcI3tlbGVtZW50fVthLXpBLVowLTlcXFxcc1xcXFwkXFxcXFxcXFwsPVxcXFxcXFwiXFxcXFxcJ1xcKFxcKV0qW1xcXFxzXSpbXFxcXCldXCIsIFwiZ1wiKVxuICAgICAgICAgICAgICAgIG1hdGNoZXMgPSByZWdleEZ1bmN0aW9uLmV4ZWMobGluZSlcblxuICAgICAgICAgICAgICAgIGlmIG51bGwgIT0gbWF0Y2hlc1xuICAgICAgICAgICAgICAgICAgICB0eXBlSGludCA9IG1hdGNoZXNbMl1cblxuICAgICAgICAgICAgICAgICAgICBpZiB0eXBlSGludC5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gQGdldEZ1bGxDbGFzc05hbWUoZWRpdG9yLCB0eXBlSGludClcblxuICAgICAgICAgICAgICAgICAgICBmdW5jTmFtZSA9IG1hdGNoZXNbMV1cblxuICAgICAgICAgICAgICAgICAgICAjIENhbiBiZSBlbXB0eSBmb3IgY2xvc3VyZXMuXG4gICAgICAgICAgICAgICAgICAgIGlmIGZ1bmNOYW1lIGFuZCBmdW5jTmFtZS5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSBwcm94eS5kb2NQYXJhbXMoQGdldEZ1bGxDbGFzc05hbWUoZWRpdG9yKSwgZnVuY05hbWUpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIHBhcmFtcy5wYXJhbXM/IGFuZCBwYXJhbXMucGFyYW1zW2VsZW1lbnRdP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBAZ2V0RnVsbENsYXNzTmFtZShlZGl0b3IsIHBhcmFtcy5wYXJhbXNbZWxlbWVudF0udHlwZSwgdHJ1ZSlcblxuICAgICAgICAgICAgY2hhaW4gPSBlZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24oW2xpbmVOdW1iZXIsIGxpbmUubGVuZ3RoXSkuZ2V0U2NvcGVDaGFpbigpXG5cbiAgICAgICAgICAgICMgQW5ub3RhdGlvbnMgaW4gY29tbWVudHMgY2FuIG9wdGlvbmFsbHkgb3ZlcnJpZGUgdGhlIHZhcmlhYmxlIHR5cGUuXG4gICAgICAgICAgICBpZiBjaGFpbi5pbmRleE9mKFwiY29tbWVudFwiKSAhPSAtMVxuICAgICAgICAgICAgICAgICMgQ2hlY2sgaWYgdGhlIGxpbmUgYmVmb3JlIGNvbnRhaW5zIGEgLyoqIEB2YXIgRm9vVHlwZSAqLywgd2hpY2ggb3ZlcnJpZGVzIHRoZSB0eXBlIG9mIHRoZSB2YXJpYWJsZVxuICAgICAgICAgICAgICAgICMgaW1tZWRpYXRlbHkgYmVsb3cgaXQuIFRoaXMgd2lsbCBub3QgZXZhbHVhdGUgdG8gLyoqIEB2YXIgRm9vVHlwZSAkc29tZVZhciAqLyAoc2VlIGJlbG93IGZvciB0aGF0KS5cbiAgICAgICAgICAgICAgICBpZiBiZXN0TWF0Y2hSb3cgYW5kIGxpbmVOdW1iZXIgPT0gKGJlc3RNYXRjaFJvdyAtIDEpXG4gICAgICAgICAgICAgICAgICAgIHJlZ2V4VmFyID0gL1xcQHZhcltcXHNdKyhbYS16QS1aX1xcXFxdKykoPyFbXFx3XStcXCQpL2dcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlcyA9IHJlZ2V4VmFyLmV4ZWMobGluZSlcblxuICAgICAgICAgICAgICAgICAgICBpZiBudWxsICE9IG1hdGNoZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBAZ2V0RnVsbENsYXNzTmFtZShlZGl0b3IsIG1hdGNoZXNbMV0pXG5cbiAgICAgICAgICAgICAgICAjIENoZWNrIGlmIHRoZXJlIGlzIGFuIFBIUFN0b3JtLXN0eWxlIHR5cGUgaW5saW5lIGRvY2Jsb2NrIHByZXNlbnQgLyoqIEB2YXIgRm9vVHlwZSAkc29tZVZhciAqLy5cbiAgICAgICAgICAgICAgICByZWdleFZhcldpdGhWYXJOYW1lID0gbmV3IFJlZ0V4cChcIlxcXFxAdmFyW1xcXFxzXSsoW2EtekEtWl9cXFxcXFxcXF0rKVtcXFxcc10rXFxcXCN7ZWxlbWVudH1cIiwgXCJnXCIpXG4gICAgICAgICAgICAgICAgbWF0Y2hlcyA9IHJlZ2V4VmFyV2l0aFZhck5hbWUuZXhlYyhsaW5lKVxuXG4gICAgICAgICAgICAgICAgaWYgbnVsbCAhPSBtYXRjaGVzXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBAZ2V0RnVsbENsYXNzTmFtZShlZGl0b3IsIG1hdGNoZXNbMV0pXG5cbiAgICAgICAgICAgICAgICAjIENoZWNrIGlmIHRoZXJlIGlzIGFuIEludGVsbGlKLXN0eWxlIHR5cGUgaW5saW5lIGRvY2Jsb2NrIHByZXNlbnQgLyoqIEB2YXIgJHNvbWVWYXIgRm9vVHlwZSAqLy5cbiAgICAgICAgICAgICAgICByZWdleFZhcldpdGhWYXJOYW1lID0gbmV3IFJlZ0V4cChcIlxcXFxAdmFyW1xcXFxzXStcXFxcI3tlbGVtZW50fVtcXFxcc10rKFthLXpBLVpfXFxcXFxcXFxdKylcIiwgXCJnXCIpXG4gICAgICAgICAgICAgICAgbWF0Y2hlcyA9IHJlZ2V4VmFyV2l0aFZhck5hbWUuZXhlYyhsaW5lKVxuXG4gICAgICAgICAgICAgICAgaWYgbnVsbCAhPSBtYXRjaGVzXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBAZ2V0RnVsbENsYXNzTmFtZShlZGl0b3IsIG1hdGNoZXNbMV0pXG5cbiAgICAgICAgICAgICMgV2UndmUgcmVhY2hlZCB0aGUgZnVuY3Rpb24gZGVmaW5pdGlvbiwgb3RoZXIgdmFyaWFibGVzIGRvbid0IGFwcGx5IHRvIHRoaXMgc2NvcGUuXG4gICAgICAgICAgICBpZiBjaGFpbi5pbmRleE9mKFwiZnVuY3Rpb25cIikgIT0gLTFcbiAgICAgICAgICAgICAgICBicmVha1xuXG4gICAgICAgICAgICAtLWxpbmVOdW1iZXJcblxuICAgICAgICByZXR1cm4gYmVzdE1hdGNoXG5cbiAgICAjIyMqXG4gICAgICogUmV0cmlldmVzIGNvbnRleHR1YWwgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGNsYXNzIG1lbWJlciBhdCB0aGUgc3BlY2lmaWVkIGxvY2F0aW9uIGluIHRoZSBlZGl0b3IuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1RleHRFZGl0b3J9IGVkaXRvciAgICAgICAgIFRleHRFZGl0b3IgdG8gc2VhcmNoIGZvciBuYW1lc3BhY2Ugb2YgdGVybS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gICAgIHRlcm0gICAgICAgICAgIFRlcm0gdG8gc2VhcmNoIGZvci5cbiAgICAgKiBAcGFyYW0ge1BvaW50fSAgICAgIGJ1ZmZlclBvc2l0aW9uIFRoZSBjdXJzb3IgbG9jYXRpb24gdGhlIHRlcm0gaXMgYXQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9ICAgICBjYWxsZWRDbGFzcyAgICBJbmZvcm1hdGlvbiBhYm91dCB0aGUgY2FsbGVkIGNsYXNzIChvcHRpb25hbCkuXG4gICAgIyMjXG4gICAgZ2V0TWVtYmVyQ29udGV4dDogKGVkaXRvciwgdGVybSwgYnVmZmVyUG9zaXRpb24sIGNhbGxlZENsYXNzKSAtPlxuICAgICAgICBpZiBub3QgY2FsbGVkQ2xhc3NcbiAgICAgICAgICAgIGNhbGxlZENsYXNzID0gQGdldENhbGxlZENsYXNzKGVkaXRvciwgdGVybSwgYnVmZmVyUG9zaXRpb24pXG5cbiAgICAgICAgaWYgbm90IGNhbGxlZENsYXNzICYmIG5vdCBAaXNGdW5jdGlvblxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgcHJveHkgPSByZXF1aXJlICcuLi9zZXJ2aWNlcy9waHAtcHJveHkuY29mZmVlJ1xuICAgICAgICBpZiBAaXNGdW5jdGlvblxuICAgICAgICAgIG1ldGhvZHMgPSBwcm94eS5mdW5jdGlvbnMoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbWV0aG9kcyA9IHByb3h5Lm1ldGhvZHMoY2FsbGVkQ2xhc3MpXG5cbiAgICAgICAgaWYgbm90IG1ldGhvZHMgfHwgbm90IG1ldGhvZHM/XG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBpZiBtZXRob2RzLmVycm9yPyBhbmQgbWV0aG9kcy5lcnJvciAhPSAnJ1xuICAgICAgICAgICAgaWYgY29uZmlnLmNvbmZpZy52ZXJib3NlRXJyb3JzXG4gICAgICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdGYWlsZWQgdG8gZ2V0IG1ldGhvZHMgZm9yICcgKyBjYWxsZWRDbGFzcywge1xuICAgICAgICAgICAgICAgICAgICAnZGV0YWlsJzogbWV0aG9kcy5lcnJvci5tZXNzYWdlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyAnRmFpbGVkIHRvIGdldCBtZXRob2RzIGZvciAnICsgY2FsbGVkQ2xhc3MgKyAnIDogJyArIG1ldGhvZHMuZXJyb3IubWVzc2FnZVxuXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgaWYgIW1ldGhvZHMudmFsdWVzPy5oYXNPd25Qcm9wZXJ0eSh0ZXJtKVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgdmFsdWUgPSBtZXRob2RzLnZhbHVlc1t0ZXJtXVxuXG4gICAgICAgICMgSWYgdGhlcmUgYXJlIG11bHRpcGxlIG1hdGNoZXMsIGp1c3Qgc2VsZWN0IHRoZSBmaXJzdCBtZXRob2QuXG4gICAgICAgIGlmIHZhbHVlIGluc3RhbmNlb2YgQXJyYXlcbiAgICAgICAgICAgIGZvciB2YWwgaW4gdmFsdWVcbiAgICAgICAgICAgICAgICBpZiB2YWwuaXNNZXRob2RcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWxcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICByZXR1cm4gdmFsdWVcblxuICAgICMjIypcbiAgICAgKiBQYXJzZSBhbGwgZWxlbWVudHMgZnJvbSB0aGUgZ2l2ZW4gYXJyYXkgdG8gcmV0dXJuIHRoZSBsYXN0IGNsYXNzTmFtZSAoaWYgYW55KVxuICAgICAqIEBwYXJhbSAgQXJyYXkgZWxlbWVudHMgRWxlbWVudHMgdG8gcGFyc2VcbiAgICAgKiBAcmV0dXJuIHN0cmluZ3xudWxsIGZ1bGwgY2xhc3MgbmFtZSBvZiB0aGUgbGFzdCBlbGVtZW50XG4gICAgIyMjXG4gICAgcGFyc2VFbGVtZW50czogKGVkaXRvciwgYnVmZmVyUG9zaXRpb24sIGVsZW1lbnRzKSAtPlxuICAgICAgICBsb29wX2luZGV4ID0gMFxuICAgICAgICBjbGFzc05hbWUgID0gbnVsbFxuICAgICAgICBpZiBub3QgZWxlbWVudHM/XG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBmb3IgZWxlbWVudCBpbiBlbGVtZW50c1xuICAgICAgICAgICAgIyAkdGhpcyBrZXl3b3JkXG4gICAgICAgICAgICBpZiBsb29wX2luZGV4ID09IDBcbiAgICAgICAgICAgICAgICBpZiBlbGVtZW50WzBdID09ICckJ1xuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWUgPSBAZ2V0VmFyaWFibGVUeXBlKGVkaXRvciwgYnVmZmVyUG9zaXRpb24sIGVsZW1lbnQpXG5cbiAgICAgICAgICAgICAgICAgICAgIyBOT1RFOiBUaGUgdHlwZSBvZiAkdGhpcyBjYW4gYWxzbyBiZSBvdmVycmlkZGVuIGxvY2FsbHkgYnkgYSBkb2NibG9jay5cbiAgICAgICAgICAgICAgICAgICAgaWYgZWxlbWVudCA9PSAnJHRoaXMnIGFuZCBub3QgY2xhc3NOYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWUgPSBAZ2V0RnVsbENsYXNzTmFtZShlZGl0b3IpXG5cbiAgICAgICAgICAgICAgICAgICAgbG9vcF9pbmRleCsrXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgICAgICAgICBlbHNlIGlmIGVsZW1lbnQgPT0gJ3N0YXRpYycgb3IgZWxlbWVudCA9PSAnc2VsZidcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lID0gQGdldEZ1bGxDbGFzc05hbWUoZWRpdG9yKVxuICAgICAgICAgICAgICAgICAgICBsb29wX2luZGV4KytcbiAgICAgICAgICAgICAgICAgICAgY29udGludWVcblxuICAgICAgICAgICAgICAgIGVsc2UgaWYgZWxlbWVudCA9PSAncGFyZW50J1xuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWUgPSBAZ2V0UGFyZW50Q2xhc3MoZWRpdG9yKVxuICAgICAgICAgICAgICAgICAgICBsb29wX2luZGV4KytcbiAgICAgICAgICAgICAgICAgICAgY29udGludWVcblxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lID0gQGdldEZ1bGxDbGFzc05hbWUoZWRpdG9yLCBlbGVtZW50KVxuICAgICAgICAgICAgICAgICAgICBsb29wX2luZGV4KytcbiAgICAgICAgICAgICAgICAgICAgY29udGludWVcblxuICAgICAgICAgICAgIyBMYXN0IGVsZW1lbnRcbiAgICAgICAgICAgIGlmIGxvb3BfaW5kZXggPj0gZWxlbWVudHMubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgICAgIGlmIGNsYXNzTmFtZSA9PSBudWxsXG4gICAgICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICAgICAgIyBDaGVjayBhdXRvY29tcGxldGUgZnJvbSBwbHVnaW5zXG4gICAgICAgICAgICBmb3VuZCA9IG51bGxcbiAgICAgICAgICAgIGZvciBwbHVnaW4gaW4gcGx1Z2lucy5wbHVnaW5zXG4gICAgICAgICAgICAgICAgY29udGludWUgdW5sZXNzIHBsdWdpbi5hdXRvY29tcGxldGU/XG4gICAgICAgICAgICAgICAgZm91bmQgPSBwbHVnaW4uYXV0b2NvbXBsZXRlKGNsYXNzTmFtZSwgZWxlbWVudClcbiAgICAgICAgICAgICAgICBicmVhayBpZiBmb3VuZFxuXG4gICAgICAgICAgICBpZiBmb3VuZFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSA9IGZvdW5kXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbWV0aG9kcyA9IHByb3h5LmF1dG9jb21wbGV0ZShjbGFzc05hbWUsIGVsZW1lbnQpXG5cbiAgICAgICAgICAgICAgICAjIEVsZW1lbnQgbm90IGZvdW5kIG9yIG5vIHJldHVybiB2YWx1ZVxuICAgICAgICAgICAgICAgIGlmIG5vdCBtZXRob2RzLmNsYXNzPyBvciBub3QgQGlzQ2xhc3MobWV0aG9kcy5jbGFzcylcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lID0gbnVsbFxuICAgICAgICAgICAgICAgICAgICBicmVha1xuXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lID0gbWV0aG9kcy5jbGFzc1xuXG4gICAgICAgICAgICBsb29wX2luZGV4KytcblxuICAgICAgICAjwqBJZiBubyBkYXRhIG9yIGEgdmFsaWQgZW5kIG9mIGxpbmUsIE9LXG4gICAgICAgIGlmIGVsZW1lbnRzLmxlbmd0aCA+IDAgYW5kIChlbGVtZW50c1tlbGVtZW50cy5sZW5ndGgtMV0ubGVuZ3RoID09IDAgb3IgZWxlbWVudHNbZWxlbWVudHMubGVuZ3RoLTFdLm1hdGNoKC8oW2EtekEtWjAtOV0kKS9nKSlcbiAgICAgICAgICAgIHJldHVybiBjbGFzc05hbWVcblxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgIyMjKlxuICAgICAqIEdldHMgdGhlIGZ1bGwgd29yZHMgZnJvbSB0aGUgYnVmZmVyIHBvc2l0aW9uIGdpdmVuLlxuICAgICAqIEUuZy4gR2V0dGluZyBhIGNsYXNzIHdpdGggaXRzIG5hbWVzcGFjZS5cbiAgICAgKiBAcGFyYW0gIHtUZXh0RWRpdG9yfSAgICAgZWRpdG9yICAgVGV4dEVkaXRvciB0byBzZWFyY2guXG4gICAgICogQHBhcmFtICB7QnVmZmVyUG9zaXRpb259IHBvc2l0aW9uIEJ1ZmZlclBvc2l0aW9uIHRvIHN0YXJ0IHNlYXJjaGluZyBmcm9tLlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gIFJldHVybnMgYSBzdHJpbmcgb2YgdGhlIGNsYXNzLlxuICAgICMjI1xuICAgIGdldEZ1bGxXb3JkRnJvbUJ1ZmZlclBvc2l0aW9uOiAoZWRpdG9yLCBwb3NpdGlvbikgLT5cbiAgICAgICAgZm91bmRTdGFydCA9IGZhbHNlXG4gICAgICAgIGZvdW5kRW5kID0gZmFsc2VcbiAgICAgICAgc3RhcnRCdWZmZXJQb3NpdGlvbiA9IFtdXG4gICAgICAgIGVuZEJ1ZmZlclBvc2l0aW9uID0gW11cbiAgICAgICAgZm9yd2FyZFJlZ2V4ID0gLy18KD86XFwoKVtcXHdcXFtcXCRcXChcXFxcXXxcXHN8XFwpfDt8J3wsfFwifFxcfC9cbiAgICAgICAgYmFja3dhcmRSZWdleCA9IC9cXCh8XFxzfFxcKXw7fCd8LHxcInxcXHwvXG4gICAgICAgIGluZGV4ID0gLTFcbiAgICAgICAgcHJldmlvdXNUZXh0ID0gJydcblxuICAgICAgICBsb29wXG4gICAgICAgICAgICBpbmRleCsrXG4gICAgICAgICAgICBzdGFydEJ1ZmZlclBvc2l0aW9uID0gW3Bvc2l0aW9uLnJvdywgcG9zaXRpb24uY29sdW1uIC0gaW5kZXggLSAxXVxuICAgICAgICAgICAgcmFuZ2UgPSBbW3Bvc2l0aW9uLnJvdywgcG9zaXRpb24uY29sdW1uXSwgW3N0YXJ0QnVmZmVyUG9zaXRpb25bMF0sIHN0YXJ0QnVmZmVyUG9zaXRpb25bMV1dXVxuICAgICAgICAgICAgY3VycmVudFRleHQgPSBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UpXG4gICAgICAgICAgICBpZiBiYWNrd2FyZFJlZ2V4LnRlc3QoZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlKSkgfHwgc3RhcnRCdWZmZXJQb3NpdGlvblsxXSA9PSAtMSB8fCBjdXJyZW50VGV4dCA9PSBwcmV2aW91c1RleHRcbiAgICAgICAgICAgICAgICBmb3VuZFN0YXJ0ID0gdHJ1ZVxuICAgICAgICAgICAgcHJldmlvdXNUZXh0ID0gZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlKVxuICAgICAgICAgICAgYnJlYWsgaWYgZm91bmRTdGFydFxuICAgICAgICBpbmRleCA9IC0xXG4gICAgICAgIGxvb3BcbiAgICAgICAgICAgIGluZGV4KytcbiAgICAgICAgICAgIGVuZEJ1ZmZlclBvc2l0aW9uID0gW3Bvc2l0aW9uLnJvdywgcG9zaXRpb24uY29sdW1uICsgaW5kZXggKyAxXVxuICAgICAgICAgICAgcmFuZ2UgPSBbW3Bvc2l0aW9uLnJvdywgcG9zaXRpb24uY29sdW1uXSwgW2VuZEJ1ZmZlclBvc2l0aW9uWzBdLCBlbmRCdWZmZXJQb3NpdGlvblsxXV1dXG4gICAgICAgICAgICBjdXJyZW50VGV4dCA9IGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSlcbiAgICAgICAgICAgIGlmIGZvcndhcmRSZWdleC50ZXN0KGN1cnJlbnRUZXh0KSB8fCBlbmRCdWZmZXJQb3NpdGlvblsxXSA9PSA1MDAgfHwgY3VycmVudFRleHQgPT0gcHJldmlvdXNUZXh0XG4gICAgICAgICAgICAgICAgZm91bmRFbmQgPSB0cnVlXG4gICAgICAgICAgICBwcmV2aW91c1RleHQgPSBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UpXG4gICAgICAgICAgICBicmVhayBpZiBmb3VuZEVuZFxuXG4gICAgICAgIHN0YXJ0QnVmZmVyUG9zaXRpb25bMV0gKz0gMVxuICAgICAgICBlbmRCdWZmZXJQb3NpdGlvblsxXSAtPSAxXG4gICAgICAgIHJldHVybiBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoW3N0YXJ0QnVmZmVyUG9zaXRpb24sIGVuZEJ1ZmZlclBvc2l0aW9uXSlcblxuICAgICMjIypcbiAgICAgKiBHZXRzIHRoZSBjb3JyZWN0IHNlbGVjdG9yIHdoZW4gYSBjbGFzcyBvciBuYW1lc3BhY2UgaXMgY2xpY2tlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge2pRdWVyeS5FdmVudH0gIGV2ZW50ICBBIGpRdWVyeSBldmVudC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge29iamVjdHxudWxsfSBBIHNlbGVjdG9yIHRvIGJlIHVzZWQgd2l0aCBqUXVlcnkuXG4gICAgIyMjXG4gICAgZ2V0Q2xhc3NTZWxlY3RvckZyb21FdmVudDogKGV2ZW50KSAtPlxuICAgICAgICBzZWxlY3RvciA9IGV2ZW50LmN1cnJlbnRUYXJnZXRcblxuICAgICAgICAkID0gcmVxdWlyZSAnanF1ZXJ5J1xuXG4gICAgICAgIGlmICQoc2VsZWN0b3IpLmhhc0NsYXNzKCdidWlsdGluJykgb3IgJChzZWxlY3RvcikuY2hpbGRyZW4oJy5idWlsdGluJykubGVuZ3RoID4gMFxuICAgICAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgICBpZiAkKHNlbGVjdG9yKS5wYXJlbnQoKS5oYXNDbGFzcygnZnVuY3Rpb24gYXJndW1lbnQnKVxuICAgICAgICAgICAgcmV0dXJuICQoc2VsZWN0b3IpLnBhcmVudCgpLmNoaWxkcmVuKCcubmFtZXNwYWNlLCAuY2xhc3M6bm90KC5vcGVyYXRvcik6bm90KC5jb25zdGFudCknKVxuXG4gICAgICAgIGlmICQoc2VsZWN0b3IpLnByZXYoKS5oYXNDbGFzcygnbmFtZXNwYWNlJykgJiYgJChzZWxlY3RvcikuaGFzQ2xhc3MoJ2NsYXNzJylcbiAgICAgICAgICAgIHJldHVybiAkKFskKHNlbGVjdG9yKS5wcmV2KClbMF0sIHNlbGVjdG9yXSlcblxuICAgICAgICBpZiAkKHNlbGVjdG9yKS5uZXh0KCkuaGFzQ2xhc3MoJ2NsYXNzJykgJiYgJChzZWxlY3RvcikuaGFzQ2xhc3MoJ25hbWVzcGFjZScpXG4gICAgICAgICAgIHJldHVybiAkKFtzZWxlY3RvciwgJChzZWxlY3RvcikubmV4dCgpWzBdXSlcblxuICAgICAgICBpZiAkKHNlbGVjdG9yKS5wcmV2KCkuaGFzQ2xhc3MoJ25hbWVzcGFjZScpIHx8ICQoc2VsZWN0b3IpLm5leHQoKS5oYXNDbGFzcygnaW5oZXJpdGVkLWNsYXNzJylcbiAgICAgICAgICAgIHJldHVybiAkKHNlbGVjdG9yKS5wYXJlbnQoKS5jaGlsZHJlbignLm5hbWVzcGFjZSwgLmluaGVyaXRlZC1jbGFzcycpXG5cbiAgICAgICAgcmV0dXJuIHNlbGVjdG9yXG5cbiAgICAjIyMqXG4gICAgICogR2V0cyB0aGUgcGFyZW50IGNsYXNzIG9mIHRoZSBjdXJyZW50IGNsYXNzIG9wZW5lZCBpbiB0aGUgZWRpdG9yXG4gICAgICogQHBhcmFtICB7VGV4dEVkaXRvcn0gZWRpdG9yIEVkaXRvciB3aXRoIHRoZSBjbGFzcyBpbi5cbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgVGhlIG5hbWVzcGFjZSBhbmQgY2xhc3Mgb2YgdGhlIHBhcmVudFxuICAgICMjI1xuICAgIGdldFBhcmVudENsYXNzOiAoZWRpdG9yKSAtPlxuICAgICAgICB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKVxuXG4gICAgICAgIGxpbmVzID0gdGV4dC5zcGxpdCgnXFxuJylcbiAgICAgICAgZm9yIGxpbmUgaW4gbGluZXNcbiAgICAgICAgICAgIGxpbmUgPSBsaW5lLnRyaW0oKVxuXG4gICAgICAgICAgICAjIElmIHdlIGZvdW5kIGV4dGVuZHMga2V5d29yZCwgcmV0dXJuIHRoZSBjbGFzc1xuICAgICAgICAgICAgaWYgbGluZS5pbmRleE9mKCdleHRlbmRzICcpICE9IC0xXG4gICAgICAgICAgICAgICAgd29yZHMgPSBsaW5lLnNwbGl0KCcgJylcbiAgICAgICAgICAgICAgICBleHRlbmRzSW5kZXggPSB3b3Jkcy5pbmRleE9mKCdleHRlbmRzJylcbiAgICAgICAgICAgICAgICByZXR1cm4gQGdldEZ1bGxDbGFzc05hbWUoZWRpdG9yLCB3b3Jkc1tleHRlbmRzSW5kZXggKyAxXSlcblxuICAgICMjIypcbiAgICAgKiBGaW5kcyB0aGUgYnVmZmVyIHBvc2l0aW9uIG9mIHRoZSB3b3JkIGdpdmVuXG4gICAgICogQHBhcmFtICB7VGV4dEVkaXRvcn0gZWRpdG9yIFRleHRFZGl0b3IgdG8gc2VhcmNoXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSAgICAgdGVybSAgIFRoZSBmdW5jdGlvbiBuYW1lIHRvIHNlYXJjaCBmb3JcbiAgICAgKiBAcmV0dXJuIHttaXhlZH0gICAgICAgICAgICAgRWl0aGVyIG51bGwgb3IgdGhlIGJ1ZmZlciBwb3NpdGlvbiBvZiB0aGUgZnVuY3Rpb24uXG4gICAgIyMjXG4gICAgZmluZEJ1ZmZlclBvc2l0aW9uT2ZXb3JkOiAoZWRpdG9yLCB0ZXJtLCByZWdleCwgbGluZSA9IG51bGwpIC0+XG4gICAgICAgIGlmIGxpbmUgIT0gbnVsbFxuICAgICAgICAgICAgbGluZVRleHQgPSBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3cobGluZSlcbiAgICAgICAgICAgIHJlc3VsdCA9IEBjaGVja0xpbmVGb3JXb3JkKGxpbmVUZXh0LCB0ZXJtLCByZWdleClcbiAgICAgICAgICAgIGlmIHJlc3VsdCAhPSBudWxsXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtsaW5lLCByZXN1bHRdXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgICAgICAgICByb3cgPSAwXG4gICAgICAgICAgICBsaW5lcyA9IHRleHQuc3BsaXQoJ1xcbicpXG4gICAgICAgICAgICBmb3IgbGluZSBpbiBsaW5lc1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IEBjaGVja0xpbmVGb3JXb3JkKGxpbmUsIHRlcm0sIHJlZ2V4KVxuICAgICAgICAgICAgICAgIGlmIHJlc3VsdCAhPSBudWxsXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbcm93LCByZXN1bHRdXG4gICAgICAgICAgICAgICAgcm93KytcbiAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAjIyMqXG4gICAgICogQ2hlY2tzIHRoZSBsaW5lVGV4dCBmb3IgdGhlIHRlcm0gYW5kIHJlZ2V4IG1hdGNoZXNcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9ICAgbGluZVRleHQgVGhlIGxpbmUgb2YgdGV4dCB0byBjaGVjay5cbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9ICAgdGVybSAgICAgVGVybSB0byBsb29rIGZvci5cbiAgICAgKiBAcGFyYW0gIHtyZWdleH0gICAgcmVnZXggICAgUmVnZXggdG8gcnVuIG9uIHRoZSBsaW5lIHRvIG1ha2Ugc3VyZSBpdCdzIHZhbGlkXG4gICAgICogQHJldHVybiB7bnVsbHxpbnR9ICAgICAgICAgIFJldHVybnMgbnVsbCBpZiBub3RoaW5nIHdhcyBmb3VuZCBvciBhblxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnQgb2YgdGhlIGNvbHVtbiB0aGUgdGVybSBpcyBvbi5cbiAgICAjIyNcbiAgICBjaGVja0xpbmVGb3JXb3JkOiAobGluZVRleHQsIHRlcm0sIHJlZ2V4KSAtPlxuICAgICAgICBpZiByZWdleC50ZXN0KGxpbmVUZXh0KVxuICAgICAgICAgICAgd29yZHMgPSBsaW5lVGV4dC5zcGxpdCgnICcpXG4gICAgICAgICAgICBwcm9wZXJ0eUluZGV4ID0gMFxuICAgICAgICAgICAgZm9yIGVsZW1lbnQgaW4gd29yZHNcbiAgICAgICAgICAgICAgICBpZiBlbGVtZW50LmluZGV4T2YodGVybSkgIT0gLTFcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eUluZGV4Kys7XG5cbiAgICAgICAgICAgICAgcmVkdWNlZFdvcmRzID0gd29yZHMuc2xpY2UoMCwgcHJvcGVydHlJbmRleCkuam9pbignICcpXG4gICAgICAgICAgICAgIHJldHVybiByZWR1Y2VkV29yZHMubGVuZ3RoICsgMVxuICAgICAgICByZXR1cm4gbnVsbFxuIl19
