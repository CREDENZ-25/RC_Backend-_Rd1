const Question = require("../models/question.models");

const addProblem = async (req, res) => {
    try{

        const { question, answer, isJunior } = req.body;
        
        const newquestion = await Question.create({
            question_text:question,
            answer:answer,
            is_junior:isJunior
        })
        res.status(200).json({ message: "Question added successfully", question: newquestion });
        }
        catch (error) {
            console.error("Error creating problem:", error);
            res.status(500).json({ error: "Error creating problem", details: error.message });
        }
}
module.exports=addProblem;
