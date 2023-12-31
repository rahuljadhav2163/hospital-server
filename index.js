import express from "express";
import mongoose from "mongoose";
import doctordata from "./src/models/Doctor.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
const PORT = 5000;



const mongoconnect = async () => {
    const connextion = await mongoose.connect(process.env.MONGO_URI);
    if (connextion) {
        console.log("MongoDB connect Succesfullly")
    }
}

mongoconnect()



app.get("/doctor", async (req, res) => {

    const doc = await doctordata.find();
    res.json({
        success: "true",
        doctor: doc,
        message: "Succesfully Fetch Data."
    })
})

app.post('/doctors', async (req, res) => {
    const { name, age, number, degree } = req.body;

    if (!name || !age || !number || !degree) {
        return res.json({
            success: false,
            message: "All fields are required",
        });
    }

    const newDoctor = new doctordata({
        name,
        age,
        number,
        degree
    })

    const savedDoctor = await newDoctor.save();

    res.json({
        success: "true",
        doctor: savedDoctor,
        message: "Succesfully Fetch Data."
    })
})

app.get("/specificdoctor", async (req, res) => {
    const { name } = req.query;

    const Doct = await doctordata.findOne({ name: name });

    res.json({
        success: "true",
        doctor: Doct,
        message: "Succesfully Fetch Data."
    })

})

app.delete('/deletedoc/:id', async (req, res) => {
    const { id } = req.params;

    await doctordata.deleteOne({ _id: id })

    res.json({
        success: "true",
        doctor: {},
        message: "Succesfully delete Data."
    })

})

app.put('/updatedoc/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age, number, degree } = req.body;

    await doctordata.updateOne({
        _id: id
    },
        {
            $set: {
                name, age, number, degree
            }
        }
    )
    if (!name || !age || !number || !degree) {
        return res.json({
            success: false,
            message: "All fields are required",
        });
    }

    const updatedDoc = await doctordata.findOne({ _id: id })
    res.json({
        success: "true",
        doctor: updatedDoc,
        message: "Succesfully Fetch Data."
    })

})

app.patch('/editdoc/:id' , async(req,res)=>{
    const { id } = req.params;
    const { name, age, number, degree } = req.body;

    const docone = await  doctordata.findOne({ _id: id })

    if(name){
        docone.name=name
    }
    if(age){
        docone.age=age
    }
    if(number){
        docone.number=number
    }
    if(degree){
        docone.degree=degree
    }

    const editDoc = await docone.save()

    res.json({
        success: "true",
        doctor: editDoc,
        message: "Succesfully edit Data."
    })
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})