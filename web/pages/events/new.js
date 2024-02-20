import { useState } from "react";
import Router from "next/router";

import redirect from "../../api/redirect";
import useRequest from "../../hooks/use-request";

const NewEvent = () => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timezone, setTimezone] = useState("");

  const { doRequest, loading, errors } = useRequest({
    url: "/api/events",
    method: "post",
    body: {
      title,
      url,
      image,
      startDate,
      startTime,
      endDate,
      endTime,
      timezone,
    },
    onSuccess: ({ id }) => Router.push(`/events/${id}`),
  });

  const onSubmit = (event) => {
    event.preventDefault();
    doRequest();
  };

  return (
    <div>
      <h1>Create a Event</h1>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
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
          <label htmlFor="url" className="form-label">
            Url
          </label>
          <input
            id="url"
            className="form-control"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Image
          </label>
          <input
            id="image"
            className="form-control"
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="startDate" className="form-label">
            Start Date
          </label>
          <input
            id="startDate"
            className="form-control"
            type="text"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="startTime" className="form-label">
            Start Time
          </label>
          <input
            id="startTime"
            className="form-control"
            type="text"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="endDate" className="form-label">
            End Date
          </label>
          <input
            id="endDate"
            className="form-control"
            type="text"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="endTime" className="form-label">
            End Time
          </label>
          <input
            id="endTime"
            className="form-control"
            type="text"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="timezone" className="form-label">
            Timezone
          </label>
          <input
            id="timezone"
            className="form-control"
            type="text"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
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

NewEvent.getInitialProps = (context, client, currentUser) => {
  if (currentUser?.email !== "mark.yehia@gmail.com") {
    return redirect({ context, path: "/" });
  }

  return {};
};
export default NewEvent;
