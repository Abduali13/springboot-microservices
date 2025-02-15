package com.techie.microservices.notification.service;

import com.techie.microservices.order.event.OrderPlacedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final JavaMailSender javaMailSender;


    @KafkaListener(topics = "order-placed")
    public void listen(OrderPlacedEvent orderPlacedEvent) {
        log.info("Got message from order-placed topic {}", orderPlacedEvent);
//        String firstName = orderPlacedEvent.getFirstName().toString(); // // todo: firstName is coming null, fix it
//        String lastName = orderPlacedEvent.getLastName().toString(); // todo: lastName is coming null, fix it

        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage);
            messageHelper.setFrom("springshop@email.com");
            messageHelper.setTo(orderPlacedEvent.getEmail().toString());
            messageHelper.setSubject(String.format("Your order with OrderNumber %s is placed successfully", orderPlacedEvent.getOrderNumber()));
            messageHelper.setText(String.format("""
                             Yo 
                                                \s
                             Your order with order number %s is placed successfully
                                                \s
                             Best Regards
                             Yo
                                                \s
                            \s""",
//                    firstName,
//                    lastName,
                    orderPlacedEvent.getOrderNumber()
            ));
        };
        try {
            javaMailSender.send(messagePreparator);
            log.info("Order Notification email sent!");
        } catch (MailException e) {
            log.error("Exception occurred while sending mail", e);
            throw new RuntimeException("Exception occurred while sending mail to springshop@email.com", e);
        }
    }
}
