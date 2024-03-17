// Query
// use sample_mflix
// show collections

db.movies.find(
    {
        $or: [
            { "tomatoes.viewer.rating": {$gte: 4.5}},
            { "tomatoes.critic.rating": {$gte: 9.5}},
        ],
    },
    { _id: 0, title: 1, runtime: 1, tomatoes: 1 }
).sort({ runtime: -1 }).limit(5)
