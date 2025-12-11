const books = require("../model/bookModel");
const stripe = require('stripe')(process.env.stripeSecretKey);

exports.addBookController = async (req, res) => {
    console.log("inside add book controller");
    const { title, author, noOfPages, imageUrl, price, dPrice, abstract, publisher, language, isbn, category } = req.body
    // console.log(title,author,noOfPages,imageUrl,price,dPrice,abstract,publisher,language,isbn,category);

    // console.log(req.files);
    var uploadImages = []
    req.files.map((item) => uploadImages.push(item.filename))
    console.log(uploadImages);

    const userMail = req.payload
    console.log(userMail);

    console.log(title, author, noOfPages, imageUrl, price, dPrice, abstract, publisher, language, isbn, category, uploadImages, userMail);


    try {
        const existingBook = await books.findOne({ title, userMail })
        if (existingBook) {
            res.status(401).json("You have already added the book")

        }
        else {
            const newBook = new books({
                title, author, noOfPages, imageUrl, price, dPrice, abstract, publisher, language, isbn, category, uploadImages, userMail
            })
            await newBook.save()
            res.status(200).json(newBook)
        }
    }
    catch (error) {
        res.status(500).json(error)
    }

}
//get home books

exports.getHomeBooksController = async (req, res) => {
    console.log("inside home book controller");
    try {
        const homeBooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(homeBooks)
    } catch (error) {
        res.status(500).json(error)
    }

}
//get all books
exports.getAllBooksController = async (req, res) => {
    console.log("inside All book controller");
    // console.log((req.query.search));

    const searchKey = req.query.search
    const userMail = req.payload

    const query = {
        title: { $regex: searchKey, $options: "i" },
        userMail: { $ne: userMail }
    }

    try {
        const allBooks = await books.find(query)
        res.status(200).json(allBooks)
    } catch (error) {
        res.status(500).json(error)
    }

}
//get a book controller
exports.getABookController = async (req, res) => {
    console.log("inside a book controller");
    const { id } = (req.params)
    console.log(id);


    try {
        const book = await books.findById({ _id: id })
        res.status(200).json(book)
    }
    catch (error) {
        res.status(500).json(error)
    }
}
//get user status
exports.getUserBooksController = async (req, res) => {
    console.log("inside the status  book controller");
    const userMail = req.payload
    try {
        const statusBook = await books.find({ userMail })
        res.status(200).json(statusBook)
    } catch (error) {
        res.status(500).json(error)
    }

}
//delete user added book
exports.deleteUserAddedBookController = async (req, res) => {
    console.log("inside the delete  book controller");
    const { id } = (req.params)
    try {
        await books.findByIdAndDelete({ _id: id })
        res.status(200).json(`Book Deleted Succesfully`)
    } catch (error) {
        res.status(500).json(error)
    }

}
//get purchase history
exports.getPurchasedBooksController = async (req, res) => {
    console.log("inside the purchased book content  book controller");
    const userMail = req.payload
    try {
        const purchasedBooks = await books.find({ boughtBy: userMail })
        res.status(200).json(purchasedBooks)
    } catch (error) {
        res.status(500).json(error)
    }

}
//---------------------admin-------------------
//get all books
exports.getAllBooksAdminController = async (req, res) => {
    console.log("inside the get all books admin  controller");
    try {
        const allAdminBooks = await books.find()
        res.status(200).json(allAdminBooks)
    } catch (error) {
        res.status(500).json(error)
    }

}
//update book status as approved
exports.updateBookController = async (req, res) => {
    console.log(`inside update book controller`);
    const { id } = (req.params)
    const updateBookData = {
        status: "approved"
    }
    try {
        const updateBook = await books.findByIdAndUpdate({ _id: id }, updateBookData, { new: true })
        res.status(200).json(updateBook)

    } catch (error) {
        res.status(500).json(error)
    }

}
//make payment
exports.makeBookPaymentController = async (req, res) => {
    console.log(`Inside Make Payment Controller`);
    const { _id, title, author, noOfPages, imageUrl, price, dPrice, abstract, publisher, language, isbn, category, uploadImages } = req.body
    const userMail = req.payload
    try {
        const updateBookPayment = await books.findByIdAndUpdate({ _id }, { title, author, noOfPages, imageUrl, price, dPrice, abstract, publisher, language, isbn, category, uploadImages, status: "sold", boughtBy: userMail }, { new: true })
        console.log(updateBookPayment);
        const line_items = [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: title,
                    description: `${author} | ${publisher}`,
                    images: [imageUrl],
                    metadata: {
                        title, author, noOfPages, imageUrl, price, dPrice, abstract, publisher, language, isbn, category, status: "sold", boughtBy: userMail
                    }
                },
                unit_amount: Math.round(dPrice * 100)
            },
            quantity: 1
        }]
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: 'payment',
            // success_url: 'http://localhost:5173/payment-success',
            // cancel_url: "http://localhost:5173/payment-error",
             success_url: 'https://book-store-alpha-nine.vercel.app/payment-success',
            cancel_url: "https://book-store-alpha-nine.vercel.app/payment-error",
        });
        console.log(session);
        res.status(200).json({ checkoutSessionUrl: session.url })
        // res.status(200).json("Success response received")
    }catch (error) {
        res.status(500).json(error)
    }
}