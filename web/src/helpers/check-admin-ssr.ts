import { QueryClient } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { companyKeys } from "src/constants/query-keys";
import { getUserCompany } from "src/services/company";

export const checkAdminSSR = async (context: GetServerSidePropsContext) => {
  const queryClient = new QueryClient()

  const session = await getSession(context)
  const user = session?.user!;

  await queryClient.prefetchQuery(companyKeys.userCompanyInfo(user.id), getUserCompany)
  const company = queryClient.getQueryData(companyKeys.userCompanyInfo(user.id)) as Company.Info;
  
  if(!company?.isAdmin) {
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