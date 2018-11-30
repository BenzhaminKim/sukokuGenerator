using System;

namespace sudoku
{
    class Shuffle //shuffle class to suffle an array.
    {
        static Random rand = new Random();
        public static int[] ShuffleArray(int[] arr) //suffle from 1 to 10 randomly.
        {
           
            for (int i = 0; i < arr.Length; i++)
            {
                Swap(arr, i, rand.Next(1, 9));
            }
            return arr;
        }

        public static void Swap(int[] arr,int a, int b) // swap element a to b in an array
        {
            int temp;
            temp = arr[a];
            arr[a] = arr[b];
            arr[b] = temp;
        }
        
    }
}
