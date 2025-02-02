const Topic = require('../../model/topic'); // Import Sequelize models
const TopicDetail = require('../../model/topicdetail'); // Import Sequelize models
const data = require('./masalahJSON.json'); // Import JSON file

// Fungsi untuk menyisipkan data ke master_topic
const insertTopic = async (topic) => {
    const master = await Topic.create({
        code: topic.code,
        name: topic.name,
        desc: topic.desc,
    });

    if (topic.children && topic.children.length > 0) {
        await insertTopicDetails(topic.children, master.id, null);
    }
};

// Fungsi rekursif untuk menyisipkan data ke detail_topic
const insertTopicDetails = async (details, masterId, parentId) => {
    for (const detail of details) {
        const newDetail = await TopicDetail.create({
            masterId: masterId,
            code: detail.code,
            name: detail.name,
            desc: detail.desc,
            parentId: parentId, // Correctly passing parentId
        });

        // Check if the current detail has children
        if (detail.children && detail.children.length > 0) {
            await insertTopicDetails(detail.children, masterId, newDetail.id); // Pass the correct new parentId
        }
    }
};

// Menyisipkan semua data JSON
const insertData = async () => {
    try {
        console.log('START SEED TOPIC');

        for (const topic of data) {
            await insertTopic(topic);
        }
        console.log('Data successfully inserted!');
        console.log('FINISH SEED TOPIC');
    } catch (error) {
        console.error('Error inserting data:', error);
    }
};

// Run the insertion process
// insertData();
module.exports = insertData;