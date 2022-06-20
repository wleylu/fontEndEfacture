import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchfilterPipe implements PipeTransform {

  // transform(items: any[], field: string, value: string): any[] {
  //   if (!items){
  //     return[];

  //   }
  //   if (!field || !value){
  //     return items;
  //   }

  //   return items.filter((singleItem) =>
  //   singleItem[field].toLowerCase().includes(value.toLowerCase())
  //   );
  // }

  transform(list: any[], value: any, key: []): any {
    value.forEach((name, index) => {
      if (name) {
        if(name == 'null'){
          return list
        }
         // alert(name + typeof name)
        list = list.filter((item) => {
          return (item[key[index]]
            .toString()
            .toLowerCase()
            .indexOf(name.toString().toLowerCase()) !== -1)
        });
      }
      
    });
    return list;
  }
}
