const Request = require("../model/request");
const { INTERESTED } = require("../config/constants");
const { default: mongoose } = require("mongoose");

const checkConnection = (fromUserId, toUserId) => {
  return Request.findOne({
    $or: [
      {
        fromUserId,
        toUserId,
      },
      {
        toUserId: fromUserId,
        fromUserId: toUserId,
      },
    ],
  });
};

const getConnection = (requestId, toUserId) => {
  return Request.findOne({
    _id: requestId,
    status: INTERESTED,
    toUserId: toUserId,
  });
};

const getConnectionCounts = async (req) => {
  const { status } = req.params;
  const toUserId = req.user._id;

  const pipeline = [
    {
      $match: {
        status: status,
        toUserId: new mongoose.Types.ObjectId(toUserId),
      },
    },
    {
      $lookup: {
        from: "Users",
        localField: "fromUserId",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              firstName: 1,
              lastName: 1,
              skill: 1,
            },
          },
        ],
        as: "userDetails",
      },
    },
    {
      $unwind: {
        path: "$userDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        status: 1,
        userDetails: 1,
      },
    },
  ];

  if (req.query.search) {
    pipeline.push({
      $match: {
        $or: [
          {
            "userDetails.firstName": {
              $regex: req.query.search,
              $options: "i",
            },
          },
          {
            "userDetails.lastName": { $regex: req.query.search, $options: "i" },
          },
        ],
      },
    });
  }

  if (req.query.isAllData) {
    const allData = await Request.aggregate(pipeline);
    const totalData = allData.length;
    return { totalResults: totalData, data: allData };
  }
  if (req.query.pageNumber) {
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (req.query.pageNumber - 1) * limit;

    pipeline.push({
      $facet: {
        totalCount: [{ $count: "count" }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    });

    const result = await Request.aggregate(pipeline);
    const totalData = result[0]?.totalCount[0]?.count || 0;
    const data = result[0]?.data || [];

    return {
      totalResults: totalData,
      totalPages: Math.ceil(totalData / limit),
      pageNumber: req.query.pageNumber,
      limit: req.query.limit,
      data,
    };
  }
};
module.exports = { checkConnection, getConnection, getConnectionCounts };
