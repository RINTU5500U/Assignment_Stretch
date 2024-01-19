const studentModel = require('../models/studentModel')
const jwt = require('jsonwebtoken')

module.exports = {
    createStudent: async (req, res) => {
        try {
            const { email } = req.body
            const findUniqueEmail = await studentModel.findOne({ email: email })
            if (findUniqueEmail) {
                return res.status(400).send({ status: true, msg: "One user is availble with this email  .. so please try different email" })
            }
            let saveData = await studentModel.create(req.body)
            return res.status(201).send({ status: true, msg: "Data created successfully", Data: saveData })
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    },

    login: async (req, res) => {
        try {
            let { email, password } = req.body
            let findUser = await studentModel.findOne({ email: email, password: password });

            if (!findUser) {
                return res.status(404).send({ status: false, message: "Either emailId or password is incorrect" })
            }
            let token = jwt.sign({ userId: findUser._id }, "Secret-key", '1h')
            res.setHeader("token", token)
            return res.status(200).send({ Message: "LoggedIn successfully", Token: token })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    // fetchUserById: async (req, res) => {
    //     try {
    //         let findUser = await studentModel.findOne({ id: req.params.userId }).select({ _id: 0 })
    //         if (!findUser) {
    //             return res.status(404).send({ status: false, msg: "User not found" })
    //         }
    //         return res.status(200).send({ status: true, Data: findUser })
    //     } catch (error) {
    //         return res.status(500).send({ status: false, message: error.message })
    //     }
    // },

    fetchUser: async (req, res) => {
        try {
            let { page } = req.query
            if (!page) {
                page = 1
            }
            let findUser = await studentModel.find().select({ _id: 0 }).skip(2 * (page - 1)).limit(10)
            return res.status(200).send({ status: true, Data: findUser })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    fetchUserByFilter: async (req, res) => {
        try {
            const { fieldOfInterest, seeking, techStack } = req.query;
            const keyword = req.body
            // Build the MongoDB query based on filters
            const query = {};

            if (fieldOfInterest) {
                query.fieldOfInterest = { $all: fieldOfInterest.split(',') };
            }

            if (seeking) {
                query.seeking = { $all: seeking.split(',') };
            }

            if (techStack) {
                query.techStack = { $all: techStack.split(',') };
            }

            if (keyword) {
                query.$or = [
                    { name: { $regex: keyword, $options: 'i' } }, // 'i' for case-insensitive
                    { bio: { $regex: keyword, $options: 'i' } }
                ];
            }

            // Exclude sensitive fields from the response
            const projection = { email: 0, password: 0, createdAt: 0, updatedAt: 0 };
            let findUser = await studentModel.find(query, projection)
            if (!findUser) {
                return res.status(404).send({ status: false, msg: 'User not found' })
            }
            return res.status(200).send({ status: true, User: findUser })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    updateUser: async (req, res) => {
        try {
            let { userId } = req.params
            let { name, email, password, dateOfGrad, github, website, bio, profilePic, fieldOfInterest, seeking, techStack } = req.body
            if (Object.keys(data).length < 1) {
                return res.status(400).send({ status: false, message: "Please enter data whatever you want to update" })
            }
            let data = {
                name,
                email,
                password,
                dateOfGrad,
                github,
                website,
                bio,
                profilePic,
                $push: { fieldOfInterest: fieldOfInterest, seeking: seeking, techStack: techStack },
                updatedAt: new Date().toLocaleString()
            }
            let updateData = await studentModel.findByIdAndUpdate(userId, data, { new: true })
            if (!updateData) {
                return res.status(404).send({ status: false, msg: "Student not found" })
            }
            return res.status(200).send({ status: true, Data: updateData })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    deleteUser: async (req, res) => {
        try {
            let deleteData = await studentModel.findByIdAndDelete(req.params.userId)
            if (!deleteData) {
                return res.status(404).send({ status: false, msg: "Student not found" })
            }
            return res.status(204).send({ status: true, msg: 'Student account deleted successfully' })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    }
}

