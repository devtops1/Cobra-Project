using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Cobra_Onboarding.ViewModels
{
    public class OrderModel
    {
        public int OrderID { get; set; }
        public DateTime? Date { get; set; }
        //public DateTime convertDate { get; set; }
        public string Name { get; set; }
        public string Product { get; set; }
        public decimal? Price { get; set; }
        public int? PersonID { get; set; }
        public int? ProductID { get; set; }
    }
}