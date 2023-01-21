export const isSubscriptionValid = (subscription: Company.Subscription) => {
  return ['ACTIVE', 'CANCELING']?.includes(subscription?.status!)
}