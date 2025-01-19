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

    if (topic.children) {
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
            parentId: parentId,
        });

        if (detail.children) {
            await insertTopicDetails(detail.children, masterId, newDetail.id);
        }
    }
};

// Menyisipkan semua data JSON
const insertData = async () => {
    try {
        for (const topic of data) {
            await insertTopic(topic);
        }
        console.log('Data successfully inserted!');
    } catch (error) {
        console.error('Error inserting data:', error);
    }
};

insertData();