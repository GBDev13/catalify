import { QueryClient } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { companyKeys } from "src/constants/query-keys";
import { getCompanySubscriptionBySlug, getUserCompany } from "src/services/company";
import { isSubscriptionValid } from "./isSubscriptionValid";

export const checkSubscriptionSSR = async (context: GetServerSidePropsContext) => {
  const queryClient = new QueryClient()

  const session = await getSession(context)
  const user = session?.user!;

  await queryClient.prefetchQuery(companyKeys.userCompanyInfo(user.id), getUserCompany)
  const company = queryClient.getQueryData(companyKeys.userCompanyInfo(user.id)) as Company.Info;

  const companySlug = company?.slug!

  await queryClient.prefetchQuery(companyKeys.companySubscription(companySlug), () => getCompanySubscriptionBySlug(companySlug))
  const companySubscriptions = queryClient.getQueryData(companyKeys.companySubscription(companySlug)) as Company.Subscription[]

  const currentSubscription = companySubscriptions?.[0];
  const hasSubscription = isSubscriptionValid(currentSubscription!)
  
  if(!hasSubscription) {
    return {
      props: {},
      redirect: {
        destination: '/dashboard',
        permanent: false
      }
    }
  }

  return { props: {} };

}