export default (params: any, isObject = true) => {
    if (isObject) {
        if (typeof params !== 'object' || params === null) {
            return '';
        }

        return (
            '?' +
            Object.entries(params)
                .map(([key, value]) => {
                    console.log('Key:', key);
                    console.log('value:', value);
                    return `${key}=${value}`;
                })
                .join('&')
        );
    } else if (Array.isArray(params) && params.length > 0) {
        return (
            '?' +
            params
                .map((obj) =>
                    Object.entries(obj)
                        .map(([key, value]) => `${key}=${value}`)
                        .join('&')
                )
                .join('&')
        );
    } else {
        return '';
    }
};
