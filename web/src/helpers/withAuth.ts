import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "src/pages/api/auth/[...nextauth]";
import api from 'src/lib/axios'

export function withAuth(gssp: GetServerSideProps): GetServerSideProps {
  return async (context) => {
    const { user } = (await unstable_getServerSession(context.req, context.res, authOptions)) || {};

    api.defaults.headers['Authorization'] = `Bearer ${user?.access_token}`;

    if (!user) {
      return {
        redirect: { statusCode: 302, destination: "/login" },
      };
    }

    const gsspData = await gssp(context);

    if (!("props" in gsspData)) {
      throw new Error("invalid getSSP result");
    }

    return gsspData
  };
}