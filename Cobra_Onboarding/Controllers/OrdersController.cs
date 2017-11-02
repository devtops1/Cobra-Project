using Cobra_Onboarding.Models;
using Cobra_Onboarding.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Cobra_Onboarding.Controllers
{
    public class OrdersController : Controller
    {
        // GET: Orders
        public ActionResult Index()
        {
            return View();
        }


        [HttpPost]//not finished
        public ActionResult AddOrders(OrderModel model)
        {
            using (var db = new CobraEntities())
            {
                var _orderHeaders = new OrderHeader
                {
                    OrderDate = model.Date,
                    PersonID = model.PersonID
                };
                db.OrderHeaders.Add(_orderHeaders);
                db.SaveChanges();
                var getOrderID = db.OrderHeaders.OrderByDescending(x => x.OrderID).Select(k => k.OrderID).First();
                var _orderDetails = new OrderDetail
                {
                    OrderID = getOrderID,
                    ProductID = model.ProductID
                };
                db.OrderDetails.Add(_orderDetails);
                db.SaveChanges();
                return Json(new { Success = true });
            }
        }

        public ActionResult EditOrder(OrderModel model)
        {
            using (var db = new CobraEntities())
            {
                var getPersonState = db.People.Where(x => x.ID == model.PersonID).FirstOrDefault();
                getPersonState.Name = model.Name;
                var getProductState = db.Products.Where(x => x.ID == model.ProductID).FirstOrDefault();
                getProductState.ProductName = model.Product;
                getProductState.Price = model.Price;
                var getOrderDate = db.OrderHeaders.Where(x => x.OrderID == model.OrderID).FirstOrDefault();
                getOrderDate.OrderDate = model.Date;
                db.SaveChanges();
                return Json(new { Success = true});
            }
        }

        [HttpGet]
        public ActionResult GetSingleProduct()
        {
            using (var db = new CobraEntities())
            {
                db.Configuration.LazyLoadingEnabled = false;
                var getSingleOrder = db.Products.Select(x => new { x.ID, x.ProductName}).ToList();
                return Json(new { Success = true, data = getSingleOrder }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult GetPrice(string productName)
        {
            using (var db = new CobraEntities())
            {
                db.Configuration.LazyLoadingEnabled = false;
                var getPrice = db.Products.SingleOrDefault(x => x.ProductName == productName).Price;
                return Json(getPrice, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult DeleteOrder(int id)
        {
            if(ModelState.IsValid)
            {
                using (var db = new CobraEntities())
                {
                    //remove the orderid child
                    db.Configuration.LazyLoadingEnabled = false;
                    //as there may be more than 1 of the same orderid present in the orderdetails table
                    var prodToDelete = db.OrderDetails.Where(x => x.OrderID == id);
                    var count = prodToDelete.Count();
                    var order = new OrderDetail();
                    for (int i = 0; i < count; i++)
                    {
                            order = prodToDelete.FirstOrDefault();
                            db.OrderDetails.Remove(order);
                            db.SaveChanges();
                    }
                    //now delete the parent in orderheader
                    for (int i = 0; i < prodToDelete.Count(); i++)
                    {
                        db.OrderDetails.Remove(prodToDelete.FirstOrDefault());
                        db.SaveChanges();
                    }
                    var getParent = db.OrderHeaders.Where(x => x.OrderID == id).FirstOrDefault();
                    db.OrderHeaders.Remove(getParent);
                    db.SaveChanges();

                }
            }
            return Json(new { Success = true }, JsonRequestBehavior.AllowGet);
        }
    }
}
