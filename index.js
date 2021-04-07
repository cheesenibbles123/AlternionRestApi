const express = require('express');
const helmet = require('helmet');
const db = require("./Handlers/database.js");

const config = require('./config.json');

const app = express();
app.use(helmet());

function returnSuccess(res,content){
  res.send({
    isSuccess : true,
    content : content
  });
}

function returnError(res,content){
  res.send({
    isSuccess : false,
    content : content
  });
}

app.get('/overview', function (req, res) {
  if (req.query.steamID && req.query.key){
    let validKey = db.authUser(req.query.steamID,req.query.key);
    if (validKey){
      let steamID = parseInt(req.query.steamID);
      if (!isNaN(steamID)){
        db.connectionPool.query(`SELECT * FROM User WHERE Steam_ID=?`,[steamID], (err,rows) => {
          if (rows.length < 1 || rows.length > 1){
            returnError(res, "Error fetching user.");
          }else{
            db.connectionPool.query(`SELECT Badge.Name AS bad, GoldMask.Name AS mas, NormalSail.Name AS sai, Tea.Name as tea, Bucket.Name as buc, TeaWater.Name as tew, MainSail.Name AS msa, Cannon.Name AS can, Flag.Name AS flg, Musket.Name AS mus, Blunderbuss.Name AS blu, Nockgun.Name AS noc, HM.Name AS han, Pis.Name AS pis, Spis.Name AS spi, Duck.Name AS duc, Mat.Name AS mat, Ann.Name AS ann, Axe.Name AS axe, Rap.Name AS rap, Dag.Name AS dag, Bot.Name AS bot, Cut.Name AS cut, Pik.Name AS pik, Tom.Name AS tom, Spy.Name AS spy, Gre.Name AS gre, Hea.Name AS hea, Ham.Name AS ham, Atl.Name AS atl FROM User INNER JOIN Badge ON Badge_ID = Badge.ID INNER JOIN GoldMask ON Mask_ID = GoldMask.ID INNER JOIN NormalSail ON Sail_ID = NormalSail.ID INNER JOIN MainSail ON Main_Sail_ID = MainSail.ID INNER JOIN Cannon ON Cannon_ID = Cannon.ID INNER JOIN Flag ON Flag_ID = Flag.ID INNER JOIN WeaponSkin AS TeaWater ON TeaWater_ID = TeaWater.ID INNER JOIN WeaponSkin AS Tea ON TeaCup_ID = Tea.ID INNER JOIN WeaponSkin AS Bucket ON Bucket_ID = Bucket.ID INNER JOIN WeaponSkin AS Musket ON Musket_ID = Musket.ID INNER JOIN WeaponSkin AS Blunderbuss ON Blunderbuss_ID = Blunderbuss.ID INNER JOIN WeaponSkin AS Nockgun ON Nockgun_ID = Nockgun.ID INNER JOIN WeaponSkin AS HM ON Handmortar_ID = HM.ID INNER JOIN WeaponSkin AS Pis ON Standard_Pistol_ID = Pis.ID INNER JOIN WeaponSkin AS Spis ON Short_Pistol_ID = Spis.ID INNER JOIN WeaponSkin AS Duck ON Duckfoot_ID = Duck.ID INNER JOIN WeaponSkin AS Mat ON Matchlock_Revolver_ID = Mat.ID INNER JOIN WeaponSkin AS Ann ON Annely_Revolver_ID = Ann.ID INNER JOIN WeaponSkin AS Axe ON Axe_ID = Axe.ID INNER JOIN WeaponSkin AS Rap ON Rapier_ID = Rap.ID INNER JOIN WeaponSkin AS Dag ON Dagger_ID = Dag.ID INNER JOIN WeaponSkin AS Bot ON Bottle_ID = Bot.ID INNER JOIN WeaponSkin AS Cut ON Cutlass_ID = Cut.ID INNER JOIN WeaponSkin AS Pik ON Pike_ID = Pik.ID INNER JOIN WeaponSkin AS Tom ON Tomohawk_ID = Tom.ID INNER JOIN WeaponSkin AS Spy ON Spyglass_ID = Spy.ID INNER JOIN WeaponSkin AS Gre ON Grenade_ID = Gre.ID INNER JOIN WeaponSkin AS Hea ON HealItem_ID = Hea.ID INNER JOIN WeaponSkin AS Ham ON Hammer_ID = Ham.ID INNER JOIN WeaponSkin AS Atl ON atlas01_ID = Atl.ID WHERE Steam_ID=?`,[steamID], (err,rows2) => {
              let data = {
                Badge       : rows2[0].bad,
                Gold_Mask   : rows2[0].mas,
                Sail        : rows2[0].sai,
                Mail_Sail   : rows2[0].msa,
                Cannon      : rows2[0].can,
                Flag        : rows2[0].flg,
                Musket      : rows2[0].mus,
                Blunderbuss : rows2[0].blu,
                Nockgun     : rows2[0].noc,
                HandMortar  : rows2[0].han,
                Pistol      : rows2[0].pis,
                Short_pistol: rows2[0].spi,
                Duckfoot    : rows2[0].duc,
                Matchlock   : rows2[0].mat,
                Annely      : rows2[0].ann,
                Axe         : rows2[0].axe,
                Rapier      : rows2[0].rap,
                Dagger      : rows2[0].dag,
                Bottle      : rows2[0].bot,
                Cutlass     : rows2[0].cut,
                Pike        : rows2[0].pik,
                Tomahawk    : rows2[0].tom,
                Spyglass    : rows2[0].spy,
                Grenade     : rows2[0].gre,
                Rum         : rows2[0].hea,
                Tea         : rows2[0].tea,
                Tea_Water   : rows2[0].tew,
                Bucket      : rows2[0].buc,
                Hammer      : rows2[0].ham,
                Atlas01     : rows2[0].atl
              }
              returnSuccess(res,data);
            });
          }
        });
      }else{
        returnError(res,"Please check your inputs.");
      }
    }else{
      returnError(res,validKey.msg);
    }
  }else{
    returnError(res,"Missing parameters.");
  }
});

app.get('/', function (req,res) {
  returnError(res,"Invalid api query.");
});
 
app.listen(config.port, () => {
  console.log("Listening on port:" + config.port);
});