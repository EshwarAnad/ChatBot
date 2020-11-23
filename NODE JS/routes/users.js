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
			//console.log(updates.messages);
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
// router.patch("/:email", async (req, res, next) => {
// 	console.log("hn");
// 	try {
// 		const email = req.params.email;
// 		const updates = req.body;
// 		//console.log(updates.messages);
// 		const result = await User.findOne({ email: email });
// 		if (result) {
// 			result.messages.push(updates.messages);
// 			let objFormat = {
// 				messages: result.messages,
// 			};
// 			console.log(objFormat);
// 			User.messages = objFormat;
// 			const updatedMesssage = await User.save();
// 			if (updatedMesssage) {
// 				return res
// 					.status(200)
// 					.send({ message: "Messsage Updated", data: updatedMesssage });
// 			}
// 			console.log(`OjectTest${objFormat}`);
// 			res.send(result);
// 		}
// 		return res.status(500).send({ message: " Error in Adding message." });
// 	} catch (error) {
// 		console.log(res.json(error));
// 	}
// });
module.exports = router;
