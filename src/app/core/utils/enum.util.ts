import { Option } from '../common/common.model';

export class EnumUtil {
  static enumToLabel(source: any, labels?: any): string {
    if (labels) {
      return labels[source];
    }
    if (source === '') {
      return '';
    }
    const list = source.split('_');
    return list.map((item) => {
      const labelItem = item.toLowerCase();
      return labelItem[0].toUpperCase() + labelItem.slice(1);
    }).join(' ');
  }

  static enumToOptions<T>(source: any, labels?: any): Option<T>[] {
    return Object.keys(source).map(key => (
      { label: EnumUtil.enumToLabel(source[key], labels), value: source[key] }
    ));
  }
}
