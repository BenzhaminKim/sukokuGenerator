using System;

namespace sudoku
{
    class Test
    {
        
        Sudoku2 sudoku2 = new Sudoku2();

        public void Looping() //tesitng using loop
        {
            for (int i = 0; i < 100; i++)
            {
                Console.WriteLine(   );
            }
        }

        public void Run() // run the sudoku class
        {
            sudoku2.Generator();
            //sudoku.SuffleMat();
            //sudoku2.ShowSquare();
            


        }
    }
}
