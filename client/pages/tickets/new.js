import { useState } from "react";
import Router from "next/router";

import useRequest from "../../hooks/use-request";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const { doRequest, loading, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: { title, price },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = (event) => {
    event.preventDefault();
    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (!isNaN(value)) {
      setPrice(value.toFixed(2));
    }
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Title
          </label>
          <input
            id="title"
            className="form-control"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            id="price"
            className="form-control"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={onBlur}
            disabled={loading}
          />
        </div>
        {errors}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          Create
        </button>
      </form>
    </div>
  );
};

export default NewTicket;
