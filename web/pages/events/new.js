import { useState } from "react";
import Router from "next/router";

import redirect from "../../api/redirect";
import useRequest from "../../hooks/use-request";
import { Title } from "../../components/title";
import { Button } from "../../components/button";
import { Form } from "../../components/form";
import { Input } from "../../components/input";

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
      <Title>Create a Event</Title>
      <Form onSubmit={onSubmit}>
        {errors}
        <label htmlFor="title">Title</label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        <label htmlFor="url">Url</label>
        <Input
          id="url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
        <label htmlFor="image">Image</label>
        <Input
          id="image"
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          disabled={loading}
        />
        <label htmlFor="startDate">Start Date</label>
        <Input
          id="startDate"
          type="text"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          disabled={loading}
        />
        <label htmlFor="startTime">Start Time</label>
        <Input
          id="startTime"
          type="text"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          disabled={loading}
        />
        <label htmlFor="endDate">End Date</label>
        <Input
          id="endDate"
          type="text"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          disabled={loading}
        />
        <label htmlFor="endTime">End Time</label>
        <Input
          id="endTime"
          type="text"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          disabled={loading}
        />
        <label htmlFor="timezone">Timezone</label>
        <Input
          id="timezone"
          type="text"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          Create
        </Button>
      </Form>
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
