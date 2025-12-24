import { useEffect, useState } from "react";
import API from "../api";
import SideBar from "../components/SideBar";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface Product {
  _id?: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const loadProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      alert("Error fetching products");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const productSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    price: Yup.number().required("Price is required"),
    description: Yup.string().required("Description required"),
    category: Yup.string().required("Category required"),
  });

  const handleEdit = (p: Product) => {
    setEditProduct(p);
    setSelectedFileName(""); // reset selected file
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    alert("Delete this product?");
    try {
      await API.delete(`/products/${id}`);
      alert("Deleted!");
      loadProducts();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleAdd = () => {
    setEditProduct(null);
    setSelectedFileName("");
    setShowModal(true);
  };

  return (
    <div className="flex">
      <SideBar />
      <div className="p-6 max-w-5xl mx-auto">
      {/* PAGE TITLE */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product CRUD</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      {/* PRODUCT TABLE */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">All Products</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Image</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="text-center">
                <td className="border p-2">
                  <img
                    src={p.image}
                    className="h-12 w-12 object-cover mx-auto rounded"
                  />
                </td>
                <td className="border p-2">{p.title}</td>
                <td className="border p-2">₹{p.price}</td>
                <td className="border p-2">{p.category}</td>
                <td className="p-2 flex justify-center gap-4">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id!)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-white flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">
              {editProduct ? "Edit Product" : "Add Product"}
            </h2>

            <Formik
              initialValues={{
                title: editProduct?.title || "",
                price: editProduct?.price || "",
                description: editProduct?.description || "",
                category: editProduct?.category || "",
                image: null as File | null,
              }}
              validationSchema={productSchema}
              onSubmit={async (values, { resetForm }) => {
                setLoading(true);
                const fd = new FormData();
                fd.append("title", values.title);
                fd.append("price", String(values.price));
                fd.append("description", values.description);
                fd.append("category", values.category);
                if (values.image) fd.append("image", values.image);

                try {
                  if (editProduct) {
                    await API.put(`/products/${editProduct._id}`, fd, {
                      headers: { "Content-Type": "multipart/form-data" },
                    });
                    alert("Product updated!");
                  } else {
                    await API.post("/products", fd, {
                      headers: { "Content-Type": "multipart/form-data" },
                    });
                    alert("Product created!");
                  }

                  loadProducts();
                  resetForm();
                  setShowModal(false);
                  setSelectedFileName("");
                  setEditProduct(null);
                } catch (err) {
                  alert("Save failed");
                }
                setLoading(false);
              }}
            >
              {({ setFieldValue }) => (
                <Form className="grid gap-4">
                  <div>
                    <Field
                      name="title"
                      className="border p-3 rounded w-full"
                      placeholder="Title"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <Field
                      name="price"
                      type="number"
                      className="border p-3 rounded w-full"
                      placeholder="Price"
                    />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <Field
                      as="textarea"
                      name="description"
                      className="border p-3 rounded w-full"
                      placeholder="Description"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <Field
                      name="category"
                      className="border p-3 rounded w-full"
                      placeholder="Category"
                    />
                    <ErrorMessage
                      name="category"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* File Input */}
                  <div>
                    <input
                      type="file"
                      id="fileInput"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setFieldValue("image", file);
                        if (file) setSelectedFileName(file.name);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById("fileInput")?.click()}
                      className="border p-2 w-full rounded text-left"
                    >
                      {selectedFileName ||
                        (editProduct
                          ? `Current file: ${editProduct.image.split("/").pop()?.slice(0, 20)}`
                          : "No file chosen")}
                    </button>
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                    >
                      {loading ? "Saving..." : editProduct ? "Update" : "Create"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setSelectedFileName("");
                        setEditProduct(null);
                      }}
                      className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProductsPage;
