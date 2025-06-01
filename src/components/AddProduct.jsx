import React, { useState } from "react";

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    mrp: "",
    rating: "",
    discount: "",
    stock: "",
    category: "",
    details: [""],
    images: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setProduct(prev => ({ ...prev, images: e.target.files }));
  };

  const handleDetailsChange = (index, value) => {
    const updated = [...product.details];
    updated[index] = value;
    setProduct(prev => ({ ...prev, details: updated }));
  };

  const addDetailField = () => {
    setProduct(prev => ({ ...prev, details: [...prev.details, ""] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => {
      if (key === "images") {
        for (let img of value) formData.append("images", img);
      } else if (key === "details") {
        for (let d of value) formData.append("details", d);
      } else {
        formData.append(key, value);
      }
    });

    try {
      const res = await fetch("http://localhost:5000/add-product", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Error submitting product.");
    }
  };

  return (
    <div className="add-product-form">
      <h2>Add Your Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input name="name" placeholder="Product Name" onChange={handleChange} required />
        <input name="brand" placeholder="Brand" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <input name="price" type="number" placeholder="Selling Price" onChange={handleChange} required />
        <input name="mrp" type="number" placeholder="MRP" onChange={handleChange} required />
        <input name="rating" type="number" placeholder="Rating (1-5)" onChange={handleChange} required />
        <input name="discount" placeholder="Discount (%)" onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock Quantity" onChange={handleChange} required />
        <input name="category" placeholder="Category" onChange={handleChange} required />
        
        {product.details.map((d, idx) => (
          <input
            key={idx}
            placeholder={`Detail ${idx + 1}`}
            value={d}
            onChange={(e) => handleDetailsChange(idx, e.target.value)}
            required
          />
        ))}
        <button type="button" onClick={addDetailField}>Add Detail</button>

        <input type="file" multiple accept="image/*" onChange={handleImageChange} required />

        <button type="submit">Submit Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
