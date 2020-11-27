(function() {
  exports.Haskell = {
    'Selection Based': {
      command: 'ghc',
      args: function(context) {
        return ['-e', context.getCode()];
      }
    },
    'File Based': {
      command: 'runhaskell',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

  exports['Literate Haskell'] = {
    'File Based': exports.Haskell['File Based']
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsZTovLy9DOi9Vc2Vycy91c2VyLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hcnMvaGFza2VsbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxPQUFPLENBQUMsT0FBUixHQUNFO0lBQUEsaUJBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxLQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtlQUFhLENBQUMsSUFBRCxFQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBUDtNQUFiLENBRE47S0FERjtJQUlBLFlBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxZQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixZQUFBO1FBQWQsV0FBRDtlQUFlLENBQUMsUUFBRDtNQUFoQixDQUROO0tBTEY7OztFQVFGLE9BQVEsQ0FBQSxrQkFBQSxDQUFSLEdBQ0U7SUFBQSxZQUFBLEVBQWMsT0FBTyxDQUFDLE9BQVEsQ0FBQSxZQUFBLENBQTlCOztBQVZGIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0cy5IYXNrZWxsID1cbiAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgY29tbWFuZDogJ2doYydcbiAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuXG4gICdGaWxlIEJhc2VkJzpcbiAgICBjb21tYW5kOiAncnVuaGFza2VsbCdcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG5leHBvcnRzWydMaXRlcmF0ZSBIYXNrZWxsJ10gPVxuICAnRmlsZSBCYXNlZCc6IGV4cG9ydHMuSGFza2VsbFsnRmlsZSBCYXNlZCddXG4iXX0=
