import bcrypt from 'bcrypt'
const usuarios=[
    {
        nombre:'Diego',
        email:'Diego@gmail.com',
        confirmado: 1,
        password: bcrypt.hashSync('123123',10)

    }
]

export default usuarios