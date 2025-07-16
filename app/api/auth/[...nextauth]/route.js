import NextAuth from 'next-auth';
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from '@/Utils/connectDb';
import users from '@/models/users';
import bcrypt from 'bcryptjs'; 

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
       const user = await users.findOne({ Username:credentials.username });
  
        if (user) {
          if (user.isactive) {
            const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
            if (isPasswordValid) {
              return { id: user._id, email: user.email, name: user.Username, role: user.admin }; // 
            } else {
              throw new Error("Invalid password");
            }
          } else {
            throw new Error("User is inactive");
          }
        } else {
          throw new Error("User not found");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {

      session.user.id = token.id;
      session.user.name = token.name;
      session.user.role = token.role;  
      
      return session;
    },
  },
});

export { handler as GET, handler as POST };
