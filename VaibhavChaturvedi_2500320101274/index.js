
const express = require("express");
const app = express();

app.use(express.json());

let leaves = [
  {
    id: 701,
    employeeName: "Ananya Singh",
    employeeCode: "EMP101",
    leaveType: "Casual",
    days: 2,
    status: "Pending"
  },
  {
    id: 702,
    employeeName: "Rahul Verma",
    employeeCode: "EMP102",
    leaveType: "Sick",
    days: 1,
    status: "Approved"
  },
  {
    id: 703,
    employeeName: "Simran Kaur",
    employeeCode: "EMP103",
    leaveType: "Earned",
    days: 3,
    status: "Rejected"
  }
];


function validateLeave(data) {
  const validLeaveTypes = ["Casual", "Sick", "Earned"];
  const validStatuses = ["Pending", "Approved", "Rejected"];

  if (
    !data.employeeName ||
    !data.employeeCode ||
    !data.leaveType ||
    data.days === undefined ||
    !data.status
  ) {
    return "All fields are required";
  }

  if (!validLeaveTypes.includes(data.leaveType)) {
    return "Invalid leaveType";
  }

  if (!Number.isInteger(data.days) || data.days <= 0) {
    return "Days must be a positive integer";
  }

  if (!validStatuses.includes(data.status)) {
    return "Invalid status";
  }

  return null;
}


app.get("/api/leaves", (req, res) => {
  res.status(200).json(leaves);
});


app.post("/api/leaves", (req, res) => {
  const error = validateLeave(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  const newId = Math.max(...leaves.map(l => l.id), 700) + 1;

  const newLeave = {
    id: newId,
    employeeName: req.body.employeeName,
    employeeCode: req.body.employeeCode,
    leaveType: req.body.leaveType,
    days: req.body.days,
    status: req.body.status
  };

  leaves.push(newLeave);

  res.status(201).json(newLeave);
});


app.get("/api/leaves/filter", (req, res) => {
  const status = req.query.status;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  const filteredLeaves = leaves.filter(
    l => l.status.toLowerCase() === status.toLowerCase()
  );

  res.status(200).json(filteredLeaves);
});


app.get("/api/leaves/pending", (req, res) => {
  const pendingLeaves = leaves.filter(
    l => l.status === "Pending"
  );

  res.status(200).json(pendingLeaves);
});


app.get("/api/leaves/:id", (req, res) => {
  const id = Number(req.params.id);

  const leave = leaves.find(l => l.id === id);

  if (!leave) {
    return res.status(404).json({ message: "Leave record not found" });
  }

  res.status(200).json(leave);
});


app.put("/api/leaves/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = leaves.findIndex(l => l.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Leave record not found" });
  }

  const error = validateLeave(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  leaves[index] = {
    id: id,
    employeeName: req.body.employeeName,
    employeeCode: req.body.employeeCode,
    leaveType: req.body.leaveType,
    days: req.body.days,
    status: req.body.status
  };

  res.status(200).json(leaves[index]);
});


app.delete("/api/leaves/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = leaves.findIndex(l => l.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Leave record not found" });
  }

  leaves.splice(index, 1);

  res.status(200).json({ message: "Leave record deleted successfully" });
});


app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
