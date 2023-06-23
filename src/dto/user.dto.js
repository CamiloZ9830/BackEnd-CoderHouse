
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

};

module.exports = UserDto;