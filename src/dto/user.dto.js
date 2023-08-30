
class UserDto {

        constructor(user) {
            this.id = user._id;
            this.firstName = user.firstName;
            this.lastName = user.lastName;
            this.userName = user.userName;
            this.email = user.email;
            this.dateOfBirth = user.dateOfBirth;
            this.password = user.password;
            this.role = user.role;
            this.createdAt = user.createdAt;
            this.lastConnection = user.lastConnection;
            this.age = user.age;

        }

        async githubDto () {
            const normalizedData = {};

                normalizedData.lastName = this.lastName;
                normalizedData.userName = this.userName;
                normalizedData.email = this.email;
 
              return normalizedData;
            };

        async  registrationDto () {
             const normalizedData = {};

             normalizedData.firstName = this.firstName;
             normalizedData.lastName = this.lastName;
             normalizedData.userName = this.userName;
             normalizedData.email = this.email;
             normalizedData.dateOfBirth = this.dateOfBirth;
             normalizedData.password = this.password;
             normalizedData.role = this.role;

             return normalizedData;
        };

        async dtoLogin () {
            const normalizedData = {};

            normalizedData.email = this.email;
            normalizedData.password = this.password;

            return normalizedData;
        };

        async userPurchaseData () {
            const normalizedData = {};

            normalizedData._id = this.id;
            normalizedData.email = this.email;

            return normalizedData;
        };

        async getUserDto () {
            const normalizedData = {};

            normalizedData._id = this.id;
            normalizedData.firstName = this.firstName;
            normalizedData.lastName = this.lastName;
            normalizedData.userName = this.userName;
            normalizedData.email = this.email;
            normalizedData.role = this.role;
            normalizedData.age = this.age;
            normalizedData.createdAt = this.createdAt;
            normalizedData.lastConnection = this.lastConnection;

            return normalizedData;
        };

};

module.exports = UserDto;