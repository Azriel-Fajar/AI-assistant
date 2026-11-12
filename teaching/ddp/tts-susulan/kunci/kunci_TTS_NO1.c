#include <stdio.h>

int main() {
    char again;
    const float SERVICE_TAX_RATE = 0.11;

    do {
        char tier;
        int n;
        float ticketTotal = 0.0;
        float discountPercent = 0.0;
        float tierDiscount = 0.0;
        float afterDiscount = 0.0;
        float voucher = 0.0;
        float taxableAmount = 0.0;
        float serviceTax = 0.0;
        float grandTotal = 0.0;

        printf("\n===== CINEMA TICKET BOOKING =====\n");
        printf("Enter membership tier (P: Platinum, V: VIP, S: Student, M: Member): ");
        scanf(" %c", &tier);

        printf("Enter the number of tickets: ");
        scanf("%d", &n);

        for (int i = 1; i <= n; i++) {
            float ticketPrice;
            printf("  Price of ticket %d: ", i);
            scanf("%f", &ticketPrice);
            ticketTotal += ticketPrice;
        }

        switch (tier) {
            case 'P':
            case 'p':
                discountPercent = 0.25;
                break;
            case 'V':
            case 'v':
                discountPercent = 0.18;
                break;
            case 'S':
            case 's':
                discountPercent = 0.12;
                break;
            case 'M':
            case 'm':
                discountPercent = 0.07;
                break;
            default:
                discountPercent = 0.00;
                break;
        }

        tierDiscount = ticketTotal * discountPercent;
        afterDiscount = ticketTotal - tierDiscount;

        if (afterDiscount > 300000.0) {
            voucher = 25000.0;
        } else {
            voucher = 0.0;
        }

        taxableAmount = afterDiscount - voucher;

        serviceTax = taxableAmount * SERVICE_TAX_RATE;
        grandTotal = taxableAmount + serviceTax;

        printf("\n----- BOOKING RECEIPT -----\n");
        printf("Total Ticket Price: Rp %.2f\n", ticketTotal);
        printf("Membership Discount (%.0f%%): Rp %.2f\n", discountPercent * 100, tierDiscount);
        printf("Total after Membership Discount: Rp %.2f\n", afterDiscount);
        if (voucher > 0.0) {
            printf("Voucher Discount: Rp %.2f\n", voucher);
        }
        printf("Service Tax (11%%): Rp %.2f\n", serviceTax);
        printf("Grand Total: Rp %.2f\n", grandTotal);

        printf("\nProcess another order? (y/n): ");
        scanf(" %c", &again);

    } while (again == 'y' || again == 'Y');

    printf("Thank you, enjoy the movie!\n");

    return 0;
}
