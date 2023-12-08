using System;
using System.Text;
namespace jwtkeygenerator
{
    public class Program
    {
        public static void Main()
        {
            var hmacKey = GenerateHmacSecretKey();
            Console.WriteLine($"HMAC secret key: {hmacKey}");
        }

        private static string GenerateHmacSecretKey()
        {
            var key = new byte[32]; // 256 bit key
            using (var generator = new System.Security.Cryptography.RNGCryptoServiceProvider())
            {
                generator.GetBytes(key);
            }
            return Convert.ToBase64String(key);
        }
    }
}
