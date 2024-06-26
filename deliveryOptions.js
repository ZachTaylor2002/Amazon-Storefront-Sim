export const deliveryOptions = [{
    id: '1',
    deliveryDays: 7,
    priceCents: 0
},{
    id: '2',
    deliveryDays: 3,
    priceCents: 899
}, {
    id: '3',
    deliveryDays: 1,
    priceCents: 1499
}];

export function getDeilveryOption(deliveryOptionId){
    let deliveryOption;

        deliveryOptions.forEach((option) => {
            if(option.id === deliveryOptionId){
                deliveryOption = option;
            }
        });
    return deliveryOption || deliveryOptions[0];
}