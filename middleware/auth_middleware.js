const jwt = require('jsonwebtoken');
//! validate the returned token
function authunticateToken(req, res , next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(" ")[1]

  
  if(token == null) return res.status(401).json({
    message: `token is null and authHeader = ${authHeader}`
  })

  jwt.verify(token, process.env.SECRET_KEY , (err, userPlayLoad)=>{
    console.log(`userPayload = ${userPlayLoad}`);
    if(err) return res.sendStatus(403);
    
    req.user = userPlayLoad;
    next();

  })
}

module.exports = authunticateToken;