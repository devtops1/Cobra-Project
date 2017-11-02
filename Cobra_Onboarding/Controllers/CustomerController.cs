using Cobra_Onboarding.Models;
using Cobra_Onboarding.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace Cobra_Onboarding.Controllers
{
    public class CustomerController : Controller
    {
        // GET: Customer
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult GetSingleCustomer()
        {
            using (var db = new CobraEntities())
            {
                db.Configuration.LazyLoadingEnabled = false;
                var getSingleCust = db.People.Select(x => new { x.ID, x.Name }).ToList();
                return Json(new { Success = true, data = getSingleCust }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult GetCustomerByID(int id)
        {
            using (var db = new CobraEntities())
            {
                db.Configuration.LazyLoadingEnabled = false;
                var getName = db.People.Where(x => x.ID == id).ToList();
                return Json(new { data = getName } , JsonRequestBehavior.AllowGet);
            }
        }

        // POST: Customer/Create
        [HttpPost]
        public ActionResult AddCustomer(CustomerModel model)
        {
            using (var db = new CobraEntities())
            {
                var _person = new Person
                {
                    Name = model.Name,
                    Address1 = model.Address1,
                    Address2 = model.Address2,
                    Town_City = model.Town_City
                };
                db.People.Add(_person);
                db.SaveChanges();
                return Json(new { Success = true, data = _person });
            }
        }

        [HttpGet]
        // GET: Customer/Edit/5
        public ActionResult GetCustByID(string custId)
        {
            using (var db = new CobraEntities())
            {
                db.Configuration.LazyLoadingEnabled = false;
                var Id = Convert.ToInt32(custId);
                var getCustomer = db.People.Where(x => x.ID == Id).FirstOrDefault();
                return Json(getCustomer, JsonRequestBehavior.AllowGet);
            }
        }

        // POST: Customer/Edit/5
        [HttpPost]
        public ActionResult EditCustomer(CustomerModel model)
        {
            using (var db = new CobraEntities())
            {
                var peopleList = db.People.Where(x => x.ID == model.ID).FirstOrDefault();
                peopleList.Name = model.Name;
                peopleList.Address1 = model.Address1;
                peopleList.Address2 = model.Address2;
                peopleList.Town_City = model.Town_City;
                db.SaveChanges();
                return Json(new { Success = true });
            }
        }

         // POST: Customer/Delete/5
        [HttpPost]
        public ActionResult Delete(int id)
        {
            if(ModelState.IsValid)
            {
                using (var db = new CobraEntities())
                {
                    db.Configuration.LazyLoadingEnabled = false;
                    var emptoDelete = db.People.Find(id);
                    db.People.Remove(emptoDelete);
                    db.SaveChanges();
                }
            }
            return Json(new { Success = true });
        }
    }
}
