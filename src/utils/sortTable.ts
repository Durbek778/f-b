interface Options {
    sortBy: string;
    sortType: 'asc' | 'desc';
}
function sortBy(options: Options, data: any[], defaultSort: string, stringSort?: any[]) {
    const { sortBy, sortType } = options;
    const dataSnapshot = data.slice();
    const isStringSort = stringSort?.includes(sortBy);
    console.log(sortBy, sortType);
    dataSnapshot.sort((a: any, b: any) => {
        if (isStringSort) {
            return sortType === 'desc' ? b[sortBy].localeCompare(a[sortBy]) : a[sortBy].localeCompare(b[sortBy]);
        } else if (sortBy) {
            const comparisonValue = a[sortBy] - b[sortBy];
            return sortType === 'desc' ? -comparisonValue : comparisonValue;
        } else {
            console.log('sorted default');
            return a[defaultSort] - b[defaultSort];
        }
    });
    console.log(dataSnapshot);
    return dataSnapshot;
}
function sortByDate(options: Options, data: any[], defaultSort: string) {
    const { sortBy, sortType } = options;
    const dataSnapshot = data?.slice();
    dataSnapshot.sort((a: any, b: any) => {
        if (sortBy) {
            const comparisonValue = new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime();
            return sortType === 'desc' ? -comparisonValue : comparisonValue;
        } else {
            return a[defaultSort] - b[defaultSort];
        }
    });
    return dataSnapshot;
}
export { sortBy, sortByDate };
