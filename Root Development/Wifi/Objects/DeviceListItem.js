import * as React from 'react';
import { List } from 'react-native-paper';

const DeviceListItem = () => (
    <List.Item
        title= {this.props.item.wifi_vendor}
        description="Item description"
    />
);

export default DeviceListItem;