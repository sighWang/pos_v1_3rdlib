function printInventory(inputs){

     var barcAndNumList = countGoods(inputs);
     var subTotalList = listGoods(barcAndNumList);
     outputList(subTotalList);
}

function countGoods(inputs){
     var barcAndNumList = [];
     var barcAndNum;
     for (var i = 0; i < inputs.length; ){

       var num = 0;
       var idx = inputs.indexOf(inputs[i]);
       while(idx != -1){
         num++;
         idx = inputs.indexOf( inputs[i] , idx + 1 );
       }
       var goods = inputs[i].split('-');

        barcAndNum = {
       'barcode': goods[0],
       'num': goods[1] * num || num
     };

       function isElement(element){
          return element != inputs[i];
       }
       inputs = inputs.filter(isElement);

       barcAndNumList.push(barcAndNum);
     }
     return barcAndNumList;
  }

function listGoods(barcAndNumList){
    var subTotalList = [];
    _.forEach(barcAndNumList, function(barcodeCount){
      var itemInfo = getItemInfo(barcodeCount);
      var promotion = getPromotion(barcodeCount);
      var item = {
          'itemInfo': itemInfo,
          'promotion': promotion
      };
      subTotalList.push(item);
    })
  return subTotalList;
}

function getItemInfo(barcAndNum){
  var allItems = loadAllItems();
  var itemInfo;
  var item = _.find(loadAllItems(), {'barcode': barcAndNum.barcode});

  itemInfo = {
    'name': item.name,
    'num':barcAndNum.num,
    'barcode': item.barcode,
    'unit': item.unit,
    'price':item.price
      };
  return itemInfo;
}

function getPromotion(barcAndNum){
  var promotion;
  var promotions = loadPromotions();
  var customPromotion = {
        'proType': 'no',
        'proNum': 0
        };
   _.each(loadPromotions(), function(promotion) {
     _.each(promotion.barcodes,function(barcode){
        if(barcode === barcAndNum.barcode){
            customPromotion = {
                'proType': promotion.type,
                'proNum': barcAndNum.num/3 | 0
             };
            }
        })
    })

  return customPromotion;
}


function outputList(subtotalList){
    var output = '***<没钱赚商店>购物清单***\n';
    output += getShopingList( subtotalList );
    console.log(output);
}

function getShopingList( subtotalList ){
    var outputFreeList = getFreeList(subtotalList);
    var myShoppingList = getMyShoppingList(subtotalList);
    var totalsAndSave = getTotalsAndSave(subtotalList);
    var output = myShoppingList + outputFreeList + totalsAndSave;
    return output;
}

function getTotalsAndSave(subtotalList){
  var totals = 0;
  var saveUp = 0;
  _.forEach(subtotalList, function(subtotal) {
        totals += subtotal.itemInfo.price * (subtotal.itemInfo.num - subtotal.promotion.proNum);
        saveUp += subtotal.itemInfo.price * subtotal.promotion.proNum || 0;
  })
  var totalsAndSave = '----------------------\n';
  totalsAndSave += '总计：' + totals.toFixed(2) + '(元)\n' +
  '节省：' + saveUp.toFixed(2) + '(元)\n' +
  '**********************';
  return totalsAndSave;
}

function getFreeList(subtotalList){
  var outputFreeList = '挥泪赠送商品：\n';
  _.forEach(subtotalList, function(subtotal){
       if(subtotal.promotion.proType !== 'no'){
       outputFreeList += '名称：' + subtotal.itemInfo.name + '，数量：' +
       subtotal.promotion.proNum + subtotal.itemInfo.unit + '\n';
      }
  })
  return outputFreeList;
}

function getMyShoppingList(subtotalList){
  var myShoppingList = '';
  _.forEach(subtotalList, function(subtotal) {
      myShoppingList += '名称：' + subtotal.itemInfo.name + '，数量：' +
      subtotal.itemInfo.num + subtotal.itemInfo.unit +
       '，单价：' + subtotal.itemInfo.price + '(元)，' +
       '小计：'  + getSubtotal(subtotal) + '(元)\n';
  })
  return myShoppingList;
}
function getSubtotal(stListItem){
  return (stListItem.itemInfo.num - stListItem.promotion.proNum ) * stListItem.itemInfo.price;
}
