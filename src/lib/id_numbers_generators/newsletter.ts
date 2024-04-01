import { utils } from '../../lib/utils.service';
import { config } from '../../config';




class NewsletterIDGenerators {

    messageID(): string {
        return `nlm_${utils.generateId(config.newsletter_message_id_chars_length, config.nanoid_alphabet)}`;
    }

    clientEmailID(): string {
        return `nec_${utils.generateId(config.newsletter_client_email_id_chars_length, config.nanoid_alphabet)}`;
    }

}


const newsletterIDGenerators = new NewsletterIDGenerators();
export { newsletterIDGenerators };
