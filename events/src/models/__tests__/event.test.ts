import { Event } from "../event";

it("should update the version key automatically", async () => {
  const { id } = await Event.build({
    title: "Event",
    url: "https://google.com",
    image: "https://placehold.it/180x60",
    start: new Date(),
    end: new Date(),
    timezone: "Europe/Berlin",
  }).save();

  const firstInstance = await Event.findById(id);
  const secondInstance = await Event.findById(id);

  firstInstance!.set("title", "Title 2");
  secondInstance!.set("title", "Title 3");

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }

  throw new Error("Should not reach this point");
});

it("increments the version number on multiple saves", async () => {
  const event = Event.build({
    title: "Event",
    url: "https://google.com",
    image: "https://placehold.it/180x60",
    start: new Date(),
    end: new Date(),
    timezone: "Europe/Berlin",
  });

  await event.save();
  expect(event.version).toEqual(0);
  await event.save();
  expect(event.version).toEqual(1);
  await event.save();
  expect(event.version).toEqual(2);
});
