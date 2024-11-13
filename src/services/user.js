const User = require("../model/user");
const Request = require("../model/request")
const mongoose = require("mongoose")
const getUserByEmail = async (email, isPassword) => {
  return User.findOne({ email: email, isDelete: false }).select(
    `${isPassword ? "+password" : "-password"} -__v -createdOn -updatedOn`
  );
};

const editUserProfile = async (user, updateBody) => {
  return Object.assign(user, updateBody).save();
};

const getUserById = async (id) => {
  return User.findOne({
    _id: id,
    isActive: true,
    isDelete: false,
  });
};

const feedData = async (req)=>{
  const allReadyUserId= new Set()
  
  const allReadyUser = await Request.aggregate([
    {
      $match:{
        $or:[
          {
            fromUserId:req.user._id
          },
          {
            toUserId:req.user._id
          }
        ]
      }
    }
  ])
 
allReadyUser.map((user)=>{
  allReadyUserId.add(user.fromUserId.toString())
  allReadyUserId.add(user.toUserId.toString())
})

const pipeline = [
  {
    $match:{
      _id:{ $nin: Array.from(allReadyUserId).map(id => new mongoose.Types.ObjectId(id)) }
    }
  },
  {
    $project:{
      firstName:1,
      lastName:1,
      skill:1
    }
  }

]
if(req.query.search)
{
  pipeline.push({
    $match:{
      $or:[
        {
          firstName:{
            $regex: req.query.search,
            $options: "i",
          }
        },
        {
          lastName:{
            $regex:req.query.search,
            $options:"i"
          }
        },
        
      ]
    }
  })
}

if(req.query.isAllData)
{
  
  
  const allData = await User.aggregate(pipeline);
  const totalData = allData.length;
  return { totalResults: totalData, data: allData };
}

if(req.query.pageNumber)
{
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (req.query.pageNumber - 1) * limit;

  pipeline.push({
    $facet: {
      totalCount: [{ $count: "count" }],
      data: [{ $skip: skip }, { $limit: limit }],
    },
  });

  const result = await User.aggregate(pipeline);
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


  

}


module.exports = { getUserByEmail, editUserProfile, getUserById ,feedData};
