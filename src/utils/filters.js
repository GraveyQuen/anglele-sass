import df from 'dateformat-util'


//  格式化日期
export const dateformat = (value, fromatStr = 'yyyy-MM-dd hh:mm') => {
  return df.format(new Date(value), fromatStr)
}

//  入库状态
export const inStatus = (val) => {
  switch (val * 1) {
    case 0:
      return '暂存'
      break;
    case 1:
      return '完成'
      break;
    case 9:
      return '取消'
      break;
    default:
      break;
  }
}

//  订单状态
export const orderStatus = (val) => {
  switch (val * 1) {
    case 1:
      return '已下单'
      break;
    case 2:
      return '已确认'
      break;
    case 3:
      return '配货中'
      break;
    case 4:
      return '配送中'
      break;
    case 5:
      return '已完成'
      break;
    case 9:
      return '取消'
      break;
    default:
      break;
  }
}
//  出库单状态
export const outStatus = (val) => {
  switch (val * 1) {
    case 1:
      return '待确认'
      break;
    case 2:
      return '已确认'
      break;
    case 3:
      return '已出库'
      break;
    case 4:
      return '已完成'
      break;
    case 9:
      return '取消'
      break;
    default:
      break;
  }
}

// 空值转换
export const emptyHlod = (value, payload = '-') => {
  if (value != '') {
    return value;
  } else {
    return payload;
  }
};