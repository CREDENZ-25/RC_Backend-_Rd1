const Question = require('../models/question.models.js');
const Progress = require('../models/progress.models.js');

const freezeController = async (req, res) => {
  const currentUserId = req.user.id;
  // console.log(currentUserId);

  try {
    const currentUserProgress = await Progress.findOne({ where: { user_id: currentUserId } });
    if (!currentUserProgress) {
      return res.status(400).json({ message: "Progress not found for current user" });
    }

    let doublell = currentUserProgress.double;
    let skipll = currentUserProgress.skip;
    let freezell = currentUserProgress.freeze;

    if (!currentUserProgress.first_attempt) {
      return res.status(400).json({ message: "Cannot use lifelines after attempting the question once" });
    }

    if (freezell === null) {
      return res.status(400).json({ message: "Increase timer lifeline is not available" });
    }

    if (freezell === true) {
      return res.status(400).json({ message: "Increase timer lifeline already used" });
    }

    doublell = (doublell === false) ? null : doublell;
    skipll = (skipll === false) ? null : skipll;

    const oldEndTime = currentUserProgress.end_time;
    const updatedEndTime = new Date(oldEndTime.getTime() + 2 * 60 * 1000);
    const timeLeft = updatedEndTime.getTime() - Date.now();

    const updatedProgress = await Progress.update({ end_time: updatedEndTime, freeze: true, doublell: doublell, streak: 0, skip: skipll }, { where: { user_id: currentUserId } });

    const doubleStatus = doublell;
    const skipStatus = skipll;
    const freezeStatus = true;

    return res.status(200).json({ message: "Time increases by 2 minutes", timeLeft: timeLeft, doubleStatus, skipStatus, freezeStatus });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { freezeController }