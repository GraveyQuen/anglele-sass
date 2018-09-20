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

// 空值转换
export const emptyHlod = (value, payload = '-') => {
    if (value != '') {
        return value;
    } else {
        return payload;
    }
};