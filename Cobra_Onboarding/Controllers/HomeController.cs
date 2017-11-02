using Cobra_Onboarding.Models;
using Cobra_Onboarding.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Cobra_Onboarding.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult GetCustomers()
        {
            using (var db = new CobraEntities())
            {
                db.Configuration.LazyLoadingEnabled = false;
                var getCustomers = db.People.OrderBy(x => x.ID).ToList();
                ViewBag.CustomerList = getCustomers;
                return Json(new { success = true, data = getCustomers }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult Customer()
        {
            return View();
        }

        public ActionResult GetOrders()
        {
            using (var db = new CobraEntities())
            {
                db.Configuration.LazyLoadingEnabled = false;
                //create a list of the model
                var getAllOrders = (from cT in db.People
                                    join oH in db.OrderHeaders on cT.ID equals oH.PersonID
                                    join oD in db.OrderDetails on oH.OrderID equals oD.OrderID
                                    join pD in db.Products on oD.ProductID equals pD.ID
                                    orderby oH.OrderID
                                    select new OrderModel
                                    {
                                        OrderID = oH.OrderID,
                                        PersonID = oH.PersonID,
                                        ProductID = oD.ProductID,
                                        Date = oH.OrderDate,
                                        Name = cT.Name,
                                        Product = pD.ProductName,
                                        Price = pD.Price

                                    }).ToList();//convert to list
                return Json(new { success = true, data = getAllOrders }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult Orders()
        {
            return View();
        }
    }
}