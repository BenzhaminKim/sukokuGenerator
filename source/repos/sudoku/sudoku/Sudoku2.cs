using System;
using System.Linq;
namespace sudoku
{
 
    class Sudoku2
    {
        static int N = 9;
        public static int[,] mat = new int[N, N];
        public static int[,] copyMat = new int[N, N];
       
        private static Random rand = new Random(DateTime.Now.Millisecond);
       

        public void Generator()
        {
            FillNumber(0, 0);
            CopyMat();
            DeleteCells(40);
            ShowSquare(mat);
            Console.WriteLine();
            ShowSquare(copyMat);
        }

        public Boolean FillNumber(int row, int col)
        {
            int[] shuffledArray = { 2, 4, 1, 8, 3, 7, 6, 9, 5 };

            int num;
            if (row >=8 && col > 8) //end
            {
                return true; 
            }
            if(col > 8 || col < 0)
            {
                row++;
                col = 0;
            }
            shuffledArray = Shuffle.ShuffleArray(shuffledArray);
            for (int i = 0; i < shuffledArray.Length; i++)
            {
                num = shuffledArray[i];
                if (IsSafe(row, col, num))
                {
                    mat[row, col] = num;

                    Console.WriteLine($"try: {row} {col} =>> {num}");
                    if (FillNumber(row, col + 1))//backtracking
                    {
                        Console.WriteLine($"success: {row} {col} =>> {num}");
                        return true;
                    }
                    mat[row, col] = 0;
                }
            }
            return false;
            
        }
        
        public int GetRandNumber() //get random number
        {
            return rand.Next(1, N + 1);
        }
        
        public Boolean IsSafe(int row,int col,int num)
        {
            return (IsSafeRow(row,num) && IsSafeCol(col,num) && IsSafeBox(row-row%3, col-col%3, num) == true);
        }

        public Boolean IsSafeRow(int row, int num)
        {
            for (int col = 0; col < N; col++)
            {
                if(mat[row,col] == num) { return false; }
            }
            return true;
        }
        public Boolean IsSafeCol(int col, int num)
        {
            for (int row = 0; row < N; row++)
            {
                if (mat[row, col] == num) { return false; }
            }
            return true;
        }
        public Boolean IsSafeBox(int startBoxRow,int startBoxCol, int num)
        {
            for (int row = 0; row < 3; row++)
            {
                for (int col = 0; col < 3; col++)
                {
                    if(mat[ row + startBoxRow, col + startBoxCol ] == num) { return false; }
                }
            }
            return true;
        }
        public void ShowSquare(int[,] arr)
        {
            for (int row = 0; row < N; row++)
            {
                for (int col = 0; col < N; col++)
                {
                    Console.Write($"{arr[row,col]} ");
                }
                Console.WriteLine();
            }
        }

        public void DeleteCells(int count)
        {
            int row;
            int col;

            while (count >=0)
            {
                row = rand.Next(0, N);
                col = rand.Next(0, N);
                if (mat[row,col] != 0)
                {
                    mat[row, col] = 0;
                    count--;
                }
            }
        }

        public void CopyMat()
        {
            for (int row = 0; row < N; row++)
            {
                for (int col = 0; col < N; col++)
                {
                    copyMat[row, col] = mat[row, col];
                }
            }
        }

    }
}
