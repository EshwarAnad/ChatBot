const express = require("express");

const router = express.Router();
const User = require("../models/User");
//Retrive all data
router.get("/", async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (err) {
		res.json({ message: err });
	}
});
router.post("/", async (req, res) => {
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		phonenumber: req.body.phonenumber,
		orderedItems: req.body.orderedItems,
		ip: req.body.ip,
		systeminfo: req.body.systeminfo,
		messages: req.body.messages,
	});
	try {
		console.log(user);
		const savedPost = await user.save();
		console.log(savedPost);
		res.json(savedPost);
	} catch (err) {
		res.json({ message: err });
	}
});
router.get("/:email", async (req, res) => {
	try {
		const email = req.params.email;
		const user = await User.findOne({ email: email });
		res.json(user);
	} catch (err) {
		res.json({ message: err });
	}
});

router.patch("/:email", async (req, res, next) => {
	try {
		const email = req.params.email;
		let updates = req.body;
		if (Object.keys(updates) == "messages") {
			const findone = await User.findOne({ email: email });
			findone.messages.push(updates.messages);
			findone.save();
		} else {
			const result = await User.findOneAndUpdate({ email: email }, updates);
		}
		res.send({ success: "Completed" });
	} catch (error) {
		console.log(res.json(error));
	}
});

module.exports = router;
