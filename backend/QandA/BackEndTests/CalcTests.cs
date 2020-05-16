using System;
using Xunit;

namespace BackEndTests
{
    public class CalcTests
    {
        [Fact]
        public void Add_When2Integers_ShouldBeReturnCorrectInteger()
        {
            var result = Calc.Add(1, 1);
            Assert.Equal(2, result);
        }
    }
}
