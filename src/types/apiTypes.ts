interface IUser {
    userId: string;
    userName: string;
    phoneNumber: string;
    email: string;
    userType: number;
    userMemo: string;
    deletedFlag?: 1 | 0;
    createdAt?: string;
    updatedAt?: string;
}

interface IStore {
    storeId?: number;
    storeName: string;
    storeAddress: string;
    storePhoneNumber: string;
    storeMemo: string;
    deletedFlag?: 1 | 0;
    createdAt?: string;
    updatedAt?: string;
}

interface IOrderTable {
    orderTableId: number;
    orderTableNumber: string;
    orderTableMemo: string;
    deletedFlag?: 1 | 0;
    createdAt?: string;
    updatedAt?: string;
}

interface IMenu {
    storeId?: number;
    menuId?: number;
    menuCategory: string;
    menuName: string;
    menuDiscountPrice: number;
    menuPrice: number;
    menuTotalPrice: number;
    menuMemo: string;
    menuImgUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}
interface IOptionMenu {
    menuId?: number;
    optionMenuId?: number;
    optionMenuCategory: string;
    optionMenuName: string;
    optionMenuDiscountPrice: number;
    optionMenuPrice: number;
    optionMenuTotalPrice: number;
    optionMenuImgUrl: string;
    optionMenuMemo: string;
    createdAt?: string;
    updatedAt?: string;
}
interface INotice {
    storeId?: number;
    noticeId?: number;
    noticeTitle: string;
    noticeContent: string;
    noticeImgUrl: string;
    createdAt?: string;
    updatedAt?: string;
}
interface IOrderCurrentOption {
    optionMenuId: number;
    optionMenuCategory: string;
    optionMenuName: string;
    optionMenuDiscountPrice: number;
    optionMenuPrice: number;
    optionMenuTotalPrice: number;
    optionMenuImgUrl: string;
    optionMenuMemo: string;
}
interface IOrderCurrentMenu {
    menuId: number;
    menuCategory: string;
    menuName: string;
    menuDiscountPrice: number;
    menuPrice: number;
    menuTotalPrice: number;
    menuImgUrl: string;
    menuMemo: string;
    option: IOrderCurrentOption[];
}

interface IOrderCurrent {
    storeId: number;
    orderTableId: number;
    orderTableNumber: string;
    orderTableMemo: string;
    deletedFlag?: 1 | 0;
    orderId: number;
    orderStatus: 1 | 2;
    orderPrice: number;
    orderDay: string;
    menu: IOrderCurrentMenu[];
    timeStamp?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface IOrderHistory {
    storeId: number;
    orderId: number;
    orderStatus: number;
    orderPrice: number;
    orderDay: string;
    menu: IOrderCurrentMenu[];
    timeStamp: string;
    createdAt: string;
    updatedAt: string;
}

interface IOrderStats {
    storeId: number;
    sumPrice: number;
    orderCount: number;
    createdAt: string;
    updatedAt: string;
}
interface IMenuStats extends IOrderCurrentMenu {}

interface IHistory {
    historyId: number;
    eventName: string;
    logText: string;
    userId: string;
    timeStamp: string;
    createdAt: string;
    updatedAt: string;
}
interface IResponse<T> {
    data: {
        items: T[];
        count: number;
    };
}
interface IResponseItem<T> {
    data: T;
}
interface IPagination {
    limit: number;
    offset: number;
}
export type {
    IStore,
    IUser,
    IOrderTable,
    IMenu,
    IOptionMenu,
    INotice,
    IOrderCurrent,
    IOrderHistory,
    IOrderStats,
    IMenuStats,
    IHistory,
    IResponse,
    IPagination,
    IResponseItem,
    IOrderCurrentMenu
};
