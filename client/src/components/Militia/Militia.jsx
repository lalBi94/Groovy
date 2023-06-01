import { Routes, Route } from 'react-router-dom'
import Home from "../../pages/Home/Home"
import Customers from "../../pages/Clients/Customers"
import Shop from "../../pages/Shop/Shop"
import Product from "../../pages/Product/Product"
import About from "../../pages/About/About"
import Admin from "../../pages/Clients/CustomerInstance/Admin/Admin"
import ItemCreator from "../../pages/Clients/CustomerInstance/Admin/ItemCreator/ItemCreator"
import PromotionCreator from "../../pages/Clients/CustomerInstance/Admin/PromotionCreator/PromotionCreator"
import CustomerInstance from "../../pages/Clients/CustomerInstance/CustomerInstance"
import Thursdaywall from "../../pages/Thursdaywall/Thursdaywall";

export default function Militia() {
    return(
        <Routes>
            <Route
                path="*"
                element={<Home />}
            />

            <Route
                path="/signin"
                element={<Customers />}
            />

            <Route
                path="/shop"
                element={<Shop />}
            />

            <Route
                path="/about"
                element={<About />}
            />

            <Route
                path="/shop/product"
                element={<Product />}
            />

            <Route
                path="/admin"
                element={<Admin />}
            />

            <Route
                path="/admin/itemcreator"
                element={<ItemCreator />}
            />

            <Route
                path="/admin/promotioncreator"
                element={<PromotionCreator />}
            />

            <Route
                path="/myaccount"
                element={<CustomerInstance />}
            />

            <Route
                path="/thursdaywall"
                element={<Thursdaywall />}
            />
        </Routes>
    )
}