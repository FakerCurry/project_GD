var RealmBase={};

import Realm from 'realm';
// const Realm = require('realm');

const HomeSchame={

    name:'HomeData',
    properties:{

        id:'int',
        title:'string',
        image:'string',
        mall:'string'

    }

}



const HTSchame={

    name:'HTData',
    properties:{

        id:'int',
        title:'string',
        image:'string',
        mall:'string'

    }

}




//初始化realm
let realm=new Realm({schema:[HomeSchame,HTSchame]});

//增加
RealmBase.create=function (schame,data) {

    realm.write(()=>{

      for (let i=0;i<data.length;i++){

          let temp=data[i];
          realm.create(schame,{id:temp.id,title:temp.title,image:temp.image,
          mall:temp.mall})

      }

    })
    
}


//查询
RealmBase.loadAll=function (schame) {

    return realm.objects(schame)

}

//条件查询
RealmBase.filtered=function (schame,filtered) {

    //获取对象
    let objects=realm.objects(schame);
    //筛选
    let object=objects.filtered(filtered);
    if (object){

        return object;
    }else {
        return '未找到数据';
    }

}

//删除
RealmBase.removeAllData=function (schame) {
    realm.write(()=>{

        //获取对象
        let objects=realm.objects(schame);
        //删除表
        realm.delete(objects)

    })
}

global.RealmBase=RealmBase;